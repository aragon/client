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
        border: 1px solid ${hasError ? theme.negative : 'transparent'};
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
            width: ${19 * GU}px;
            text-align: center;
          `}
        >
          <img
            css={`
              display: block;
              margin: 0 auto;
            `}
            src={illustration}
            alt=""
            width="110"
          />
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
  hasError: PropTypes.bool,
  illustration: PropTypes.node.isRequired,
  onActivate: PropTypes.func.isRequired,
  subtitle: PropTypes.node,
  title: PropTypes.node.isRequired,
}

export default WelcomeAction
