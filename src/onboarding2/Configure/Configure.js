import React from 'react'
import { useViewport, GU } from '@aragon/ui'
import Templates from '../Templates/Templates'
import ConfigureStepsPanel from './ConfigureStepsPanel'
import ConfigureTemplateScreens from './ConfigureTemplateScreens'

function Configure({
  TemplateScreen,
  mode,
  onNextTemplateScreen,
  onPrevTemplateScreen,
  onUseTemplate,
  status,
  stepIndex,
  steps,
  template,
  templateData,
  templateScreenIndex,
  templates,
}) {
  const { above } = useViewport()
  const screens = (template && template.screens) || []
  return (
    <React.Fragment>
      {above('large') && (
        <div
          css={`
            width: ${41 * GU}px;
            flex-shrink: 0;
            flex-grow: 0;
          `}
        >
          <ConfigureStepsPanel step={stepIndex} steps={steps} />
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
          {mode === 'select' && (
            <Templates onUse={onUseTemplate} templates={templates} />
          )}
          {mode === 'configure' && (
            <ConfigureTemplateScreens
              TemplateScreen={TemplateScreen}
              onNext={onNextTemplateScreen}
              onPrev={onPrevTemplateScreen}
              screenIndex={templateScreenIndex}
              screens={screens}
              templateData={templateData}
            />
          )}
        </div>
      </section>
    </React.Fragment>
  )
}

export default Configure
