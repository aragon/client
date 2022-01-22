import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Card, Tag, textStyle, GU, Button, useTheme } from '@aragon/ui'
import { OrgTemplateType } from '../../prop-types'

function TemplateCard({ onOpen, template }) {
  const theme = useTheme()
  const handleDetailsClick = useCallback(() => {
    onOpen(template.id)
  }, [onOpen, template.id])
  return (
    <Card
      width="100%"
      height="100%"
      css={`
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
      `}
    >
      <section
        css={`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          overflow: hidden;
        `}
      >
        <div>
          <img
            src={template.header}
            alt=""
            css={`
              display: block;
              width: 100%;
              pointer-events: none;
            `}
          />
          <div
            css={`
              padding: ${2.5 * GU}px ${3 * GU}px 0;
            `}
          >
            <h1
              css={`
                display: flex;
                align-items: center;
                padding-bottom: ${1 * GU}px;
                ${textStyle('body1')};
              `}
            >
              <span>{template.name}</span>
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
                ${textStyle('body2')};
                color: ${theme.surfaceContentSecondary};
              `}
            >
              {template.description}
            </p>
          </div>
        </div>
        <div
          css={`
            padding: 0 ${3 * GU}px ${2 * GU}px;
          `}
        >
          <Button wide label="View details" onClick={handleDetailsClick} />
        </div>
      </section>
    </Card>
  )
}

TemplateCard.propTypes = {
  onOpen: PropTypes.func.isRequired,
  template: OrgTemplateType.isRequired,
}

export default TemplateCard
