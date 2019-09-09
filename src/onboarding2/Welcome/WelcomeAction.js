import React from 'react'
import PropTypes from 'prop-types'
import { Card, GU, textStyle, useTheme } from '@aragon/ui'

function WelcomeAction({
  hasError,
  illustration,
  onActivate,
  subtitle,
  title,
}) {
  const theme = useTheme()
  return (
    <Card
      onClick={onActivate}
      width="100%"
      height={150}
      css={`
        margin-top: ${1.5 * GU}px;
        ${hasError && `border: 1px solid ${theme.negative};`}
      `}
    >
      <section
        css={`
          display: flex;
          width: 100%;
          align-items: center;
        `}
      >
        <div
          css={`
            display: flex;
            justify-content: center;
            width: ${19 * GU}px;
          `}
        >
          <img src={illustration} alt="" width="110" />
        </div>
        <div>
          <h1
            css={`
              ${textStyle('title4')};
              margin-bottom: ${0.5 * GU}px;
            `}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              css={`
                ${textStyle('body2')};
                color: ${theme.surfaceContentSecondary};
              `}
            >
              {subtitle}
            </p>
          )}
        </div>
      </section>
    </Card>
  )
}

WelcomeAction.propTypes = {
  illustration: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  onActivate: PropTypes.func.isRequired,
}

export default WelcomeAction
