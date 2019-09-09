import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  fetchApmArtifact,
  getRecommendedGasLimit,
} from '../../aragonjs-wrapper'
import { EthereumAddressType } from '../../prop-types'
import { log } from '../../utils'
import {
  loadTemplateState,
  saveTemplateState,
  prepareTransactionCreatorFromAbi,
} from '../create-utils'
import Configure from '../Configure/Configure'
import Deployment from '../Deployment/Deployment'

const STATUS_SELECT_TEMPLATE = Symbol('STATUS_TEMPLATE')
const STATUS_TEMPLATE_SCREENS = Symbol('STATUS_TEMPLATE_SCREENS')
const STATUS_DEPLOYMENT = Symbol('STATUS_DEPLOYMENT')

// Used during the template selection phase, since we don’t know yet what are
// going to be the configuration steps.
const CONFIGURE_PLACEHOLDER_SCREENS = [
  'Claim a name',
  'Configure template',
  'Review information',
]

function getConfigureSteps(status, template, templateData) {
  if (!template || status === STATUS_SELECT_TEMPLATE) {
    return [
      'Select template',
      ...CONFIGURE_PLACEHOLDER_SCREENS,
      'Launch organization',
    ]
  }
  return [
    template.name,
    ...template.screens.map(([name]) =>
      typeof name === 'function' ? name(templateData) : name
    ),
    'Launch organization',
  ]
}

function getTemplateById(templates, templateId) {
  return templates.find(template => template.id === templateId)
}

// Handle and store everything related to a template state.
function useConfigureState(templates, onScreenUpdate) {
  // The current template
  const [template, setTemplate] = useState(null)

  // The current screen in the template
  const [templateScreenIndex, setTemplateScreenIndex] = useState(-1)

  // The data stored by the configuration screens
  const [templateData, setTemplateData] = useState({})

  const updateTemplateScreen = useCallback(
    (templateId, screenIndex = 0) => {
      const template = getTemplateById(templates, templateId)
      setTemplate(template)
      setTemplateScreenIndex(screenIndex)
      onScreenUpdate(screenIndex, template ? template.screens : [])
    },
    [templates, onScreenUpdate]
  )

  useEffect(() => {
    const {
      templateData,
      templateId,
      templateScreenIndex,
    } = loadTemplateState()

    if (templateId) {
      updateTemplateScreen(templateId, templateScreenIndex)
      setTemplateData(templateData)
    }
  }, [updateTemplateScreen])

  // Save the template state
  useEffect(() => {
    if (template && template.id) {
      saveTemplateState({
        templateData,
        templateId: template.id,
        templateScreenIndex,
      })
    }
  }, [templateData, template, templateScreenIndex])

  const relativeScreen = useCallback(
    diff => {
      const updatedScreenIndex = templateScreenIndex + diff

      // Back to the templates selection
      if (updatedScreenIndex < 0 || !template) {
        setTemplateData({})
        updateTemplateScreen(null, -1)
        return
      }

      updateTemplateScreen(
        template.id,
        Math.min(template.screens.length, updatedScreenIndex)
      )
    },
    [updateTemplateScreen, templateScreenIndex, template]
  )

  const prevScreen = useCallback(() => {
    relativeScreen(-1)
  }, [relativeScreen])

  const nextScreen = useCallback(
    (templateData = {}) => {
      setTemplateData(templateData)
      relativeScreen(1)
    },
    [relativeScreen]
  )

  const TemplateScreen = useMemo(() => {
    return (
      (template &&
        template.screens[templateScreenIndex] &&
        template.screens[templateScreenIndex][1]) ||
      (() => null)
    )
  }, [template, templateScreenIndex])

  return {
    TemplateScreen,
    nextScreen,
    prevScreen,
    setTemplateData,
    template,
    templateData,
    templateScreenIndex,
    updateTemplateScreen,
  }
}

function useTemplateRepoInformation(templateRepoAddress) {
  const [
    fetchingTemplateInformation,
    setFetchingTemplateInformation,
  ] = useState(false)
  const [templateAbi, setTemplateAbi] = useState(null)
  const [templateAddress, setTemplateAddress] = useState(null)

  // Fetch latest information about the template from its aragonPM repository
  useEffect(() => {
    if (!templateRepoAddress) {
      return
    }

    setFetchingTemplateInformation(true)

    let cancelled = false
    const fetchArtifact = () => {
      fetchApmArtifact(templateRepoAddress)
        .then(templateInfo => {
          if (!cancelled) {
            setTemplateAddress(templateInfo.contractAddress)
            setTemplateAbi(templateInfo.abi)
            setFetchingTemplateInformation(false)
          }
          return null
        })
        .catch(() => {
          // Continuously re-request until this component gets unmounted or the template changes
          if (!cancelled) {
            fetchArtifact()
          }
        })
    }

    fetchArtifact()

    return () => {
      cancelled = true
    }
  }, [templateRepoAddress])

  return {
    fetchingTemplateInformation,
    templateAbi,
    templateAddress,
  }
}

function useDeploymentState(
  walletWeb3,
  account,
  status,
  template,
  templateData,
  templateAbi,
  templateAddress,
  applyEstimateGas
) {
  const [transactionProgress, setTransactionProgress] = useState({
    signing: 0,
    error: -1,
  })

  const deployTransactions = useMemo(
    () =>
      status === STATUS_DEPLOYMENT && templateAbi && templateAddress
        ? template.prepareTransactions(
            prepareTransactionCreatorFromAbi(templateAbi, templateAddress),
            templateData
          )
        : null,
    [status, templateAbi, templateAddress, template, templateData]
  )

  // Call tx functions in the template, one after another.
  useEffect(() => {
    setTransactionProgress({ signed: 0, errored: -1 })

    if (!deployTransactions) {
      return
    }

    let cancelled = false
    const createTransactions = async () => {
      // Only process the next transaction after the previous one was successfully mined
      deployTransactions.reduce(async (deployPromise, { transaction }) => {
        // Wait for the previous promise; if component has unmounted, don't progress any further
        await deployPromise

        transaction = {
          ...transaction,
          from: account,
        }
        try {
          transaction = await applyEstimateGas(transaction)
        } catch (_) {}

        if (!cancelled) {
          try {
            await walletWeb3.eth.sendTransaction(transaction)

            if (!cancelled) {
              setTransactionProgress(({ signed, errored }) => ({
                signed: signed + 1,
                errored,
              }))
            }
          } catch (err) {
            log('Failed onboarding transaction', err)
            if (!cancelled) {
              setTransactionProgress(({ signed, errored }) => ({
                errored: signed,
                signed,
              }))
            }

            // Re-throw error to stop later transactions from being signed
            throw err
          }
        }
      }, Promise.resolve())
    }
    createTransactions()
  }, [walletWeb3, account, applyEstimateGas, deployTransactions])

  const transactionsStatus = useMemo(() => {
    if (!deployTransactions) {
      return []
    }

    const { signed, errored } = transactionProgress
    const status = index => {
      if (errored !== -1 && index >= errored) {
        return 'error'
      }
      if (index === signed) {
        return 'pending'
      }
      if (index < signed) {
        return 'success'
      }
      return 'upcoming'
    }

    return deployTransactions.map(({ name }, index) => ({
      name,
      status: status(index),
    }))
  }, [deployTransactions, transactionProgress])

  return {
    deployTransactions,
    signedTransactions: transactionProgress.signed,
    transactionsStatus,
  }
}

function Create({ account, onOpenOrg, templates, walletWeb3, web3 }) {
  const [status, setStatus] = useState(STATUS_SELECT_TEMPLATE)

  const onScreenUpdate = useCallback((index, screens) => {
    if (index > -1 && index < screens.length) {
      setStatus(STATUS_TEMPLATE_SCREENS)
      return
    }
    if (index === screens.length && screens.length > 0) {
      setStatus(STATUS_DEPLOYMENT)
      return
    }
    setStatus(STATUS_SELECT_TEMPLATE)
  }, [])

  const {
    TemplateScreen,
    nextScreen,
    prevScreen,
    template,
    templateData,
    templateScreenIndex,
    updateTemplateScreen,
  } = useConfigureState(templates, onScreenUpdate)

  const configureSteps = getConfigureSteps(status, template, templateData)

  // The current create step (includes the template selection
  // and “launch organization”).
  const configureStepIndex = useMemo(() => {
    if (status === STATUS_SELECT_TEMPLATE) {
      return 0
    }
    if (status === STATUS_DEPLOYMENT) {
      return configureSteps.length - 1
    }
    return templateScreenIndex + 1
  }, [status, configureSteps.length, templateScreenIndex])

  const {
    fetchingTemplateInformation,
    templateAbi,
    templateAddress,
  } = useTemplateRepoInformation(template && template.repoAddress)

  const applyEstimateGas = useCallback(
    async transaction => {
      const estimatedGas = await web3.eth.estimateGas(transaction)
      const recommendedLimit = await getRecommendedGasLimit(
        web3,
        estimatedGas,
        { gasFuzzFactor: 1.1 }
      )
      return {
        ...transaction,
        gas: recommendedLimit,
      }
    },
    [web3]
  )

  const {
    deployTransactions,
    signedTransactions,
    transactionsStatus,
  } = useDeploymentState(
    walletWeb3,
    account,
    status,
    template,
    templateData,
    templateAbi,
    templateAddress,
    applyEstimateGas
  )

  const handleUseTemplate = useCallback(
    id => {
      updateTemplateScreen(id)
    },
    [updateTemplateScreen]
  )

  const handleTemplateNext = useCallback(data => nextScreen(data), [nextScreen])
  const handleTemplatePrev = useCallback(() => prevScreen(), [prevScreen])

  const handleOpenNewOrg = useCallback(() => {
    if (templateData && templateData.domain) {
      onOpenOrg(templateData.domain)
    }
  }, [templateData, onOpenOrg])

  return (
    <div
      css={`
        display: flex;
        width: 100%;
        min-height: 100%;
        flex-grow: 1;
      `}
    >
      {status === STATUS_DEPLOYMENT ? (
        <Deployment
          loadingTransactions={fetchingTemplateInformation}
          onOpenOrg={handleOpenNewOrg}
          ready={
            Array.isArray(deployTransactions) &&
            deployTransactions.length > 0 &&
            signedTransactions === deployTransactions.length
          }
          transactionsStatus={transactionsStatus}
        />
      ) : (
        <Configure
          mode={status === STATUS_SELECT_TEMPLATE ? 'select' : 'configure'}
          TemplateScreen={TemplateScreen}
          onNextTemplateScreen={handleTemplateNext}
          onPrevTemplateScreen={handleTemplatePrev}
          onUseTemplate={handleUseTemplate}
          status={status}
          stepIndex={configureStepIndex}
          steps={configureSteps}
          template={template}
          templateData={templateData}
          templateScreenIndex={templateScreenIndex}
          templates={templates}
        />
      )}
    </div>
  )
}
Create.propTypes = {
  account: EthereumAddressType,
  onOpenOrg: PropTypes.func.isRequired,
  templates: PropTypes.array.isRequired,
  walletWeb3: PropTypes.object,
  web3: PropTypes.object,
}

export default Create
