import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Switch,
  Field,
  IconCheck,
  GU,
  Link,
  Modal,
  Tag,
  textStyle,
  unselectable,
  useViewport,
  useTheme,
} from '@aragon/ui'
import { TEMPLATE_LOADING, TEMPLATE_UNAVAILABLE } from '../symbols'
import { stripUrlProtocol, sanitizeCodeRepositoryUrl } from '../../util/url'
import AppIcon from '../../components/AppIcon/AppIcon'
import KnownAppBadge from '../../templates/kit/KnownAppBadge'
import { trackEvent, events } from '../../analytics'
import { useWallet } from '../../contexts/wallet'

function TemplateDetails({ template, visible, onUse, onClose }) {
  const theme = useTheme()
  const { networkName } = useWallet()
  const { above, below, width } = useViewport()
  const [templateOptionalApps, setTemplateOptionalApps] = useState({})

  const handleUseClick = useCallback(() => {
    const selectedOptionalApps = Object.entries(templateOptionalApps)
      .filter(([_, value]) => Boolean(value))
      .map(([appName]) => appName)
    onUse(template.id, selectedOptionalApps)

    // analytics test
    trackEvent(events.DAO_CREATION_TEMPLATE_SELECTED, {
      name: template.name,
      network: networkName,
    })
  }, [onUse, template, templateOptionalApps, networkName])

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
                display: flex;
                align-items: center;

                // Not in aragonUI - exceptionally used here
                font-size: 40px;
                font-weight: 600;
                padding: ${3 * GU}px 0 ${2 * GU}px;
              `}
            >
              {template.name}
              {(template.disabled ||
                template.new ||
                template.beta ||
                template.not_maintained) && (
                <Tag
                  mode="new"
                  css={`
                    margin-left: ${1 * GU}px;
                    flex-shrink: 0;
                  `}
                >
                  {template.disabled
                    ? 'Coming soon'
                    : template.beta
                    ? 'Beta'
                    : template.not_maintained
                    ? 'Not Maintained'
                    : 'New'}
                </Tag>
              )}
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
              {template.userGuideUrl && (
                <Field label="User guide">
                  <Link href={template.userGuideUrl}>
                    {sanitizeCodeRepositoryUrl(
                      stripUrlProtocol(template.userGuideUrl)
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

          {template.apps && template.apps.length > 0 && (
            <Field
              label="Included apps"
              css={`
                margin-bottom: ${4 * GU}px;
              `}
            >
              {template.apps.map(({ appName, label }, index) => (
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
          {template.optionalApps && template.optionalApps.length > 0 && (
            <Field
              label="Optional apps"
              css={`
                height: 150px;
              `}
            >
              {() =>
                template.optionalApps.map(({ appName, label }, index) => (
                  <div
                    key={index}
                    css={`
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      margin-top: ${2 * GU}px;

                      & + & {
                        margin-top: ${1.5 * GU}px;
                      }
                    `}
                  >
                    <KnownAppBadge appName={appName} label={label} />
                    <Switch
                      checked={templateOptionalApps[appName]}
                      onChange={() => {
                        setTemplateOptionalApps(apps => ({
                          ...apps,
                          [appName]: !apps[appName],
                        }))
                      }}
                    />
                  </div>
                ))
              }
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
  const templateUnavailable =
    template.disabled || template.status === TEMPLATE_UNAVAILABLE
  const label = templateUnavailable
    ? 'This template is not available at the moment'
    : templateLoading
    ? 'Loading template…'
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
