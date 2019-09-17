import React from 'react'
import PropTypes from 'prop-types'
import { useViewport, GU } from '@aragon/ui'
import Templates from '../Templates/Templates'
import ConfigureStepsPanel from './ConfigureStepsPanel'
import ConfigureTemplateScreens from './ConfigureTemplateScreens'
import * as CreateStatuses from '../Create/create-statuses'
import { OrgTemplateType } from '../../prop-types'

export const CONFIGURE_MODE_SELECT = Symbol('CONFIGURE_MODE_SELECT')
export const CONFIGURE_MODE_CONFIGURE = Symbol('CONFIGURE_MODE_CONFIGURE')

function Configure({
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
          {mode === CONFIGURE_MODE_SELECT && (
            <Templates onUse={onUseTemplate} templates={templates} />
          )}
          {mode === CONFIGURE_MODE_CONFIGURE && (
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

Configure.propTypes = {
  TemplateScreen: PropTypes.func.isRequired,
  mode: PropTypes.oneOf([CONFIGURE_MODE_SELECT, CONFIGURE_MODE_CONFIGURE])
    .isRequired,
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

export default Configure
