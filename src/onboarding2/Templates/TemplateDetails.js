import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Checkbox,
  Field,
  IconCheck,
  GU,
  Link,
  Modal,
  textStyle,
  unselectable,
  useViewport,
  useTheme,
} from '@aragon/ui'
import { TEMPLATE_LOADING, TEMPLATE_UNAVAILABLE } from '../symbols'
import { stripUrlProtocol, sanitizeCodeRepositoryUrl } from '../../url-utils'
import AppIcon from '../../components/AppIcon/AppIcon'
import KnownAppBadge from '../../templates/kit/KnownAppBadge'

function TemplateDetails({ template, visible, onUse, onClose }) {
  const theme = useTheme()
  const { above, below, width } = useViewport()
  const [templateOptionalModules, setTemplateOptionalModules] = useState({})

  const handleUseClick = useCallback(() => {
    const selectedOptionalModules = Object.entries(templateOptionalModules)
      .filter(([_, value]) => Boolean(value))
      .map(([appName]) => appName)
    onUse(template.id, selectedOptionalModules)
  }, [onUse, template, templateOptionalModules])

  const handleSectionRef = useCallback(element => {
    if (element) {
      element.focus()
    }
  }, [])

  const modalWidth = useCallback(() => {
    if (above('large')) {
      return 130 * GU
    }
    if (above('medium')) {
      return 80 * GU
    }
    return width - 4 * GU
  }, [above, width])

  if (template === null) {
    return null
  }

  let padding = 2 * GU
  if (above('medium')) padding = 5 * GU
  if (above('large')) padding = 7 * GU

  const verticalMode = below('large')

  return (
    <Modal visible={visible} width={modalWidth} onClose={onClose} padding={0}>
      <section
        ref={handleSectionRef}
        tabIndex="0"
        css={`
          outline: 0;
          ${verticalMode
            ? ''
            : `
              display: grid;
              grid-template-columns: auto ${48 * GU}px;
            `};
        `}
      >
        <div
          css={`
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: ${padding}px;
          `}
        >
          <div>
            <div css="display: flex">
              <AppIcon src={template.icon} size={6.5 * GU} />
            </div>
            <h1
              css={`
                // Not in aragonUI - exceptionally used here
                font-size: 40px;
                font-weight: 600;
                padding: ${3 * GU}px 0 ${2 * GU}px;
              `}
            >
              {template.name}
            </h1>
            <p
              css={`
                ${textStyle('body1')};
                color: ${theme.contentSecondary};
              `}
            >
              {template.longdesc || template.description}
            </p>
            <div
              css={`
                margin: ${5 * GU}px 0 0;
              `}
            >
              {template.caseStudyUrl && (
                <Field label="Case study">
                  <Link href={template.caseStudyUrl}>
                    {sanitizeCodeRepositoryUrl(
                      stripUrlProtocol(template.caseStudyUrl)
                    )}
                  </Link>
                </Field>
              )}
              {template.userGuide && (
                <Field label="User guide">
                  <Link href={template.userGuide}>
                    {sanitizeCodeRepositoryUrl(
                      stripUrlProtocol(template.userGuide)
                    )}
                  </Link>
                </Field>
              )}
              <Field label="Source code">
                <Link href={template.sourceCodeUrl}>
                  {sanitizeCodeRepositoryUrl(
                    stripUrlProtocol(template.sourceCodeUrl)
                  )}
                </Link>
              </Field>
              <Field label="Registry">{template.registry}</Field>
            </div>
          </div>

          {!verticalMode && (
            <SelectTemplateButton
              onClick={handleUseClick}
              template={template}
            />
          )}
        </div>
        <div
          css={`
            height: 100%;
            width: ${verticalMode ? 'auto' : `${48 * GU}px`};
            padding: ${verticalMode
              ? `${padding}px`
              : `${7 * GU}px ${3 * GU}px`};
            background: ${theme.background};
          `}
        >
          <h2
            css={`
              padding-bottom: ${3 * GU}px;
              ${textStyle('body1')};
            `}
          >
            Template configuration
          </h2>

          {template.modules && template.modules.length > 0 && (
            <Field
              label="Required modules"
              css={`
                height: 150px;
                margin-bottom: ${4 * GU}px;
              `}
            >
              {template.modules.map(({ appName, label }, index) => (
                <div
                  key={index}
                  css={`
                    display: flex;
                    justify-content: space-between;
                    margin-top: ${2 * GU}px;

                    & + & {
                      margin-top: ${1.5 * GU}px;
                    }
                  `}
                >
                  <KnownAppBadge appName={appName} label={label} />
                  <div
                    css={`
                      display: flex;
                      align-items: center;
                      ${unselectable}
                    `}
                  >
                    <IconCheck
                      css={`
                        color: ${theme.positive};
                        margin-right: ${0.25 * GU}px;
                      `}
                    />
                    Included
                  </div>
                </div>
              ))}
            </Field>
          )}
          {template.optionalModules && template.optionalModules.length > 0 && (
            <Field
              label="Optional modules"
              css={`
                height: 150px;
              `}
            >
              {template.optionalModules.map(({ appName, label }, index) => (
                <div
                  key={index}
                  css={`
                    display: flex;
                    justify-content: space-between;
                    margin-top: ${2 * GU}px;

                    & + & {
                      margin-top: ${1.5 * GU}px;
                    }
                  `}
                >
                  <KnownAppBadge appName={appName} label={label} />
                  <div
                    css={`
                      display: flex;
                      align-items: center;
                      ${unselectable}
                    `}
                  >
                    <Checkbox
                      checked={templateOptionalModules[appName]}
                      onChange={() => {
                        setTemplateOptionalModules(modules => ({
                          ...modules,
                          [appName]: !modules[appName],
                        }))
                      }}
                      css={`
                        margin-right: ${1.5 * GU}px;
                        border-color: ${theme.hint};
                        &:active {
                          border-color: ${theme.hint};
                        }
                      `}
                    />
                    Include
                  </div>
                </div>
              ))}
            </Field>
          )}
          {verticalMode && (
            <SelectTemplateButton
              onClick={handleUseClick}
              template={template}
            />
          )}
        </div>
      </section>
    </Modal>
  )
}
TemplateDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUse: PropTypes.func.isRequired,
  template: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
}

function SelectTemplateButton({ onClick, template }) {
  const templateLoading = template.status === TEMPLATE_LOADING
  const templateUnavailable = template.status === TEMPLATE_UNAVAILABLE
  const label = templateLoading
    ? 'Loading template…'
    : templateUnavailable
    ? 'This template is not available at the moment'
    : 'Use this template'

  return (
    <Button
      disabled={templateLoading || templateUnavailable}
      label={label}
      mode="strong"
      onClick={onClick}
      wide
    />
  )
}
SelectTemplateButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  template: PropTypes.object.isRequired,
}

export default TemplateDetails
