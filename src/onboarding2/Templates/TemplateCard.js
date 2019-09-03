import React, { useCallback } from 'react'
import { Card, textStyle, GU, Button, useTheme } from '@aragon/ui'
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
                padding-bottom: ${1 * GU}px;
                ${textStyle('body1')};
              `}
            >
              {template.name}
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
          <Button label="View details" wide onClick={handleDetailsClick} />
        </div>
      </section>
    </Card>
  )
}

TemplateCard.propTypes = {
  template: OrgTemplateType.isRequired,
}

export default TemplateCard
