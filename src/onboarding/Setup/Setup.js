import React from 'react'
import PropTypes from 'prop-types'
import { useViewport, GU } from '@aragon/ui'
import ConfigureTemplateScreens from './ConfigureTemplateScreens'
import SetupStepsPanel from './SetupStepsPanel'
import * as CreateStatuses from '../Create/create-statuses'
import Templates from '../Templates/Templates'
import { OrgTemplateType } from '../../prop-types'

export const SETUP_MODE_SELECT = Symbol('SETUP_MODE_SELECT')
export const SETUP_MODE_CONFIGURE = Symbol('SETUP_MODE_CONFIGURE')

function Setup({
  TemplateScreen,
  mode,
  onNextTemplateScreen,
  onPrevTemplateScreen,
  onUseTemplate,
  status,
  stepIndex,
  steps,
  templateData,
  templateScreenIndex,
  screens,
  templates,
}) {
  const { above } = useViewport()
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
          <SetupStepsPanel step={stepIndex} steps={steps} />
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
          {mode === SETUP_MODE_SELECT && (
            <Templates onUse={onUseTemplate} templates={templates} />
          )}
          {mode === SETUP_MODE_CONFIGURE && (
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

Setup.propTypes = {
  TemplateScreen: PropTypes.func.isRequired,
  mode: PropTypes.oneOf([SETUP_MODE_SELECT, SETUP_MODE_CONFIGURE]).isRequired,
  onNextTemplateScreen: PropTypes.func.isRequired,
  onPrevTemplateScreen: PropTypes.func.isRequired,
  onUseTemplate: PropTypes.func.isRequired,
  status: PropTypes.oneOf(Object.values(CreateStatuses)).isRequired,
  stepIndex: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  screens: PropTypes.array.isRequired,
  templateData: PropTypes.object.isRequired,
  templateScreenIndex: PropTypes.number.isRequired,
  templates: PropTypes.arrayOf(OrgTemplateType).isRequired,
}

export default Setup
