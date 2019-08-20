import React from 'react'
import { Card, textStyle, GU, Button, useTheme } from '@aragon/ui'
import { OrgTemplateType } from '../../prop-types'

function TemplateCard({ template }) {
  const theme = useTheme()
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
          padding: ${22 * GU}px ${3 * GU}px 0;
          background: 0 0 / contain no-repeat url(${template.header});
        `}
      >
        <div>
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
        <div
          css={`
            padding-bottom: ${2 * GU}px;
          `}
        >
          <Button label="View details" wide />
        </div>
      </section>
    </Card>
  )
}

TemplateCard.propTypes = {
  template: OrgTemplateType.isRequired,
}

export default TemplateCard
