import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useViewport, GU } from '@aragon/ui'
import { log } from '../../utils'
import { loadTemplateState, saveTemplateState } from '../create-utils'
import templates from '../../templates'
import Templates from '../Templates/Templates'
import Deployment from '../Deployment/Deployment'
import DeploymentStepsPanel from '../Deployment/DeploymentStepsPanel'
import CreateStepsPanel from './CreateStepsPanel'
import TemplateScreens from './TemplateScreens'

// TODO: move the creation state at an upper level, and use Create/Create and
// Deployment/Deployment from there (rather than having Deployment inside Create).

const STATUS_SELECT_TEMPLATE = Symbol('STATUS_TEMPLATE')
const STATUS_TEMPLATE_SCREENS = Symbol('STATUS_TEMPLATE_SCREENS')
const STATUS_DEPLOYMENT = Symbol('STATUS_DEPLOYMENT')

// Used during the template selection phase, since we don’t know yet what are
// going to be the configuration steps.
const PLACEHOLDER_SCREENS = [
  'Claim domain',
  'Configure template',
  'Review information',
]

function getSteps(status, template, templateData) {
  if (!template || status === STATUS_SELECT_TEMPLATE) {
    return ['Select template', ...PLACEHOLDER_SCREENS, 'Launch organization']
  }
  return [
    template.name,
    ...template.screens.map(([name]) =>
      typeof name === 'function' ? name(templateData) : name
    ),
    'Launch organization',
  ]
}

function getTemplate(templateId) {
  return templates.find(template => template.id === templateId)
}

// Handle and store everything related to a template state.
function useTemplateState({ onScreenUpdate }) {
  // The current template
  const [template, setTemplate] = useState(null)

  // The current screen in the template
  const [templateScreenIndex, setTemplateScreenIndex] = useState(-1)

  // The data stored by the configuration screens
  const [templateData, setTemplateData] = useState({})

  const updateTemplateScreen = useCallback(
    (templateId, screenIndex = 0) => {
      const template = getTemplate(templateId)
      setTemplate(template)
      setTemplateScreenIndex(screenIndex)
      onScreenUpdate(screenIndex, template ? template.screens : [])
    },
    [onScreenUpdate]
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

function useDeploymentState(status, template, templateData) {
  const [signedTransactions, setSignedTransactions] = useState(0)

  const deployTransactions = useMemo(
    () =>
      status === STATUS_DEPLOYMENT
        ? template.prepareTransactions(function createTransaction(name, args) {
            // TODO
            return [name, args]
          }, templateData)
        : null,
    [template, status, templateData]
  )

  // Call tx functions in the template, one after another.
  useEffect(() => {
    setSignedTransactions(0)

    if (!deployTransactions) {
      return
    }

    const createTransactions = async () => {
      for (const deployTransaction of deployTransactions) {
        await new Promise(resolve =>
          setTimeout(() => {
            log('Transaction:', deployTransaction.transaction)
            resolve()
          }, 3000)
        )
        setSignedTransactions(signed => signed + 1)
      }
    }
    createTransactions()
  }, [deployTransactions])

  const transactionsStatus = useMemo(() => {
    if (!deployTransactions) {
      return []
    }

    const status = index => {
      if (index === signedTransactions) {
        return 'pending'
      }
      if (index < signedTransactions) {
        return 'success'
      }
      return 'upcoming'
    }

    return deployTransactions.map(({ name }, index) => ({
      name,
      status: status(index),
    }))
  }, [deployTransactions, signedTransactions])

  return {
    deployTransactions,
    signedTransactions,
    transactionsStatus,
  }
}

function Create() {
  const { above } = useViewport()

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
  } = useTemplateState({ onScreenUpdate })

  const steps = getSteps(status, template, templateData)

  // The current create step (includes the template selection
  // and “launch organization”).
  const stepIndex = useMemo(() => {
    if (status === STATUS_SELECT_TEMPLATE) {
      return 0
    }
    if (status === STATUS_DEPLOYMENT) {
      return steps.length - 1
    }
    return templateScreenIndex + 1
  }, [status, steps.length, templateScreenIndex])

  const {
    deployTransactions,
    signedTransactions,
    transactionsStatus,
  } = useDeploymentState(status, template, templateData)

  const handleUseTemplate = useCallback(
    id => {
      updateTemplateScreen(id)
    },
    [updateTemplateScreen]
  )

  const handleTemplateNext = useCallback(data => nextScreen(data), [nextScreen])
  const handleTemplatePrev = useCallback(() => prevScreen(), [prevScreen])

  return (
    <div
      css={`
        display: flex;
        width: 100%;
        min-height: 100%;
        flex-grow: 1;
      `}
    >
      {above('large') && (
        <div
          css={`
            width: ${41 * GU}px;
            flex-shrink: 0;
            flex-grow: 0;
          `}
        >
          {status !== STATUS_DEPLOYMENT && (
            <CreateStepsPanel step={stepIndex} steps={steps} />
          )}
          {status === STATUS_DEPLOYMENT && (
            <DeploymentStepsPanel transactionsStatus={transactionsStatus} />
          )}
        </div>
      )}
      <section
        css={`
          display: flex;
          flex-direction: column;
          width: 100%;
          flex-grow: 1;
          flex-shrink: 1;
        `}
      >
        <div
          css={`
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            position: relative;
            overflow: hidden;
          `}
        >
          {status === STATUS_SELECT_TEMPLATE && (
            <Templates templates={templates} onUse={handleUseTemplate} />
          )}
          {status === STATUS_TEMPLATE_SCREENS && (
            <TemplateScreens
              TemplateScreen={TemplateScreen}
              onNext={handleTemplateNext}
              onPrev={handleTemplatePrev}
              screenIndex={templateScreenIndex}
              screens={template.screens}
              templateData={templateData}
            />
          )}
          {status === STATUS_DEPLOYMENT && (
            <Deployment
              ready={signedTransactions === deployTransactions.length}
            />
          )}
        </div>
      </section>
    </div>
  )
}

export default Create
