import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useViewport, GU } from '@aragon/ui'
import templates from '../../templates'
import Templates from '../Templates/Templates'
import Deployment from '../Deployment/Deployment'
import DeploymentStepsPanel from '../Deployment/DeploymentStepsPanel'
import CreateStepsPanel from './CreateStepsPanel'
import { loadTemplateState, saveTemplateState } from '../create-utils'

// TODO: move the creation state at an upper level, and use Create/Create and
// Deployment/Deployment from there (instead of using Deployment from Create).

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
    ...((template.template && template.template.screens) || []).map(([name]) =>
      typeof name === 'function' ? name(templateData) : name
    ),
    'Launch organization',
  ]
}

// Handle and store everything related to a template state.
function useTemplateState() {
  const [templateId, setTemplateId] = useState(null)
  const [templateScreenIndex, setTemplateScreenIndex] = useState(-1)
  const [templateData, setTemplateData] = useState({})

  useEffect(() => {
    if (templateId) {
      saveTemplateState({
        templateData,
        templateId,
        templateScreenIndex,
      })
    }
  }, [templateData, templateId, templateScreenIndex])

  useEffect(() => {
    const {
      templateData,
      templateId,
      templateScreenIndex,
    } = loadTemplateState()

    if (templateId) {
      setTemplateData(templateData)
      setTemplateId(templateId)
      setTemplateScreenIndex(templateScreenIndex)
    }
  }, [])

  const [template, screens] = useMemo(() => {
    const template = templates.find(template => template.id === templateId)
    return [
      template,
      (template && template.template && template.template.screens) || [],
    ]
  }, [templateId])

  const updateScreenIndex = useCallback(
    diff => {
      const updatedScreenIndex = templateScreenIndex + diff

      // Back to the templates selection
      if (updatedScreenIndex < 0) {
        setTemplateData({})
        setTemplateId(null)
        setTemplateScreenIndex(-1)
        return
      }

      setTemplateScreenIndex(Math.min(screens.length, updatedScreenIndex))
    },
    [screens, templateScreenIndex]
  )

  const prevScreen = useCallback(() => {
    updateScreenIndex(-1)
  }, [updateScreenIndex])

  const nextScreen = useCallback(
    (templateData = {}) => {
      setTemplateData(templateData)
      updateScreenIndex(1)
    },
    [updateScreenIndex]
  )

  const setTemplate = useCallback(id => {
    setTemplateId(id)
    setTemplateScreenIndex(0)
  }, [])

  const TemplateScreen = useMemo(
    () =>
      (screens[templateScreenIndex] && screens[templateScreenIndex][1]) ||
      (() => null),
    [screens, templateScreenIndex]
  )

  return {
    TemplateScreen,
    nextScreen,
    prevScreen,
    setTemplate,
    setTemplateData,
    template,
    templateData,
    templateScreenIndex,
    templateScreens: screens,
  }
}

function useDeploymentState(status, template, templateData) {
  const [signedTransactions, setSignedTransactions] = useState(0)

  const deployTransactions = useMemo(
    () =>
      status === STATUS_DEPLOYMENT
        ? template.template.deploy({}, templateData)
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
      const allReturnValues = []
      for (const deployTransaction of deployTransactions) {
        allReturnValues.push(
          await deployTransaction.transaction(allReturnValues)
        )
        setSignedTransactions(allReturnValues.length)
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

  const {
    TemplateScreen,
    nextScreen,
    prevScreen,
    setTemplate,
    template,
    templateData,
    templateScreenIndex,
    templateScreens,
  } = useTemplateState()

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

  const { transactionsStatus } = useDeploymentState(
    status,
    template,
    templateData
  )

  // On load, restore the state directly
  useEffect(() => {
    if (
      templateScreenIndex > -1 &&
      templateScreenIndex < templateScreens.length
    ) {
      setStatus(STATUS_TEMPLATE_SCREENS)
      return
    }
    if (templateScreenIndex === templateScreens.length) {
      setStatus(STATUS_DEPLOYMENT)
      return
    }
    setStatus(STATUS_SELECT_TEMPLATE)
  }, [templateScreenIndex, templateScreens])

  const handleUseTemplate = useCallback(
    id => {
      setStatus(STATUS_TEMPLATE_SCREENS)
      setTemplate(id)
    },
    [setTemplate]
  )

  const handleTemplateNext = useCallback(data => nextScreen(data), [nextScreen])
  const handleTemplateBack = useCallback(() => prevScreen(), [prevScreen])

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
          `}
        >
          {status === STATUS_SELECT_TEMPLATE && (
            <Templates templates={templates} onUse={handleUseTemplate} />
          )}
          {status === STATUS_TEMPLATE_SCREENS && (
            <div
              css={`
                display: grid;
                align-items: center;
                justify-content: center;
              `}
            >
              <div
                css={`
                  max-width: ${82 * GU}px;
                  padding: 0 ${3 * GU}px ${3 * GU}px;
                `}
              >
                <TemplateScreen
                  data={templateData}
                  fields={
                    {
                      /* TODO: pass the fields from the template contract */
                    }
                  }
                  next={handleTemplateNext}
                  back={handleTemplateBack}
                  screens={templateScreens}
                  screenIndex={templateScreenIndex}
                />
              </div>
            </div>
          )}
          {status === STATUS_DEPLOYMENT && <Deployment />}
        </div>
      </section>
    </div>
  )
}

export default Create
