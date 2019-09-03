import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useViewport, GU } from '@aragon/ui'
import templates from '../../templates'
import Templates from '../Templates/Templates'
import CreateStepsPanel from './CreateStepsPanel'
import { network } from '../../environment'

const STATUS_SELECT_TEMPLATE = Symbol('STATUS_TEMPLATE')
const STATUS_TEMPLATE_SCREENS = Symbol('STATUS_TEMPLATE_SCREENS')
const STATUS_LAUNCH = Symbol('STATUS_LAUNCH')

// Used during the template selection phase, since we don’t know yet what are
// going to be the configuration steps.
const PLACEHOLDER_SCREENS = [
  'Claim domain',
  'Configure template',
  'Review information',
]

function getSteps(status, template) {
  if (!template || status === STATUS_SELECT_TEMPLATE) {
    return ['Select template', ...PLACEHOLDER_SCREENS, 'Launch organization']
  }
  return [
    template.name,
    ...((template.template && template.template.screens) || []).map(
      ([name]) => name
    ),
    'Launch organization',
  ]
}

function loadTemplateState() {
  const value = localStorage.getItem(`create-org:${network.type}`)
  try {
    const data = JSON.parse(value)
    return {
      templateScreenIndex: data.templateScreenIndex,
      templateData: data.templateData || {},
      templateId: data.templateId,
    }
  } catch (err) {
    return {}
  }
}

function saveTemplateState(state) {
  localStorage.setItem(`create-org:${network.type}`, JSON.stringify(state))
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

      setTemplateScreenIndex(screenIndex =>
        Math.min(screens.length - 1, updatedScreenIndex)
      )
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

function Create() {
  const { above } = useViewport()

  const [status, setStatus] = useState(STATUS_SELECT_TEMPLATE)
  const [templateId, setTemplateId] = useState(null)

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

  console.log('TTT_TTT', templateData)

  const steps = getSteps(status, template)

  // The current create step (includes the template selection
  // and “launch organization”).
  const stepIndex = useMemo(() => {
    if (status === STATUS_SELECT_TEMPLATE) {
      return 0
    }
    if (status === STATUS_LAUNCH) {
      return steps.length - 1
    }
    return templateScreenIndex + 1
  }, [status, steps])

  // On load, restore the state directly
  useEffect(() => {
    if (template) {
      setStatus(STATUS_TEMPLATE_SCREENS)
    } else {
      setStatus(STATUS_SELECT_TEMPLATE)
    }
  }, [template])

  const handleUseTemplate = useCallback(
    id => {
      setStatus(STATUS_TEMPLATE_SCREENS)
      setTemplate(id)
    },
    [setTemplate]
  )

  const handleTemplateNext = useCallback(
    data => {
      nextScreen(data)
    },
    [nextScreen]
  )

  const handleTemplateBack = useCallback(() => {
    prevScreen()
  }, [prevScreen])

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
          <CreateStepsPanel step={stepIndex} steps={steps} />
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
          {status === STATUS_LAUNCH && null}
          {status === STATUS_TEMPLATE_SCREENS && (
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
          )}
        </div>
      </section>
    </div>
  )
}

export default Create
