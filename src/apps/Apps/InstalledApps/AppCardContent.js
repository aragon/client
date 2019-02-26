import React from 'react'
import PropTypes from 'prop-types'
import color from 'onecolor'
import { Badge, Button, font, theme } from '@aragon/ui'

const AppCardContent = ({
  app: { appName, name, icon, description, canUpgrade },
  onOpen,
}) => (
  <section
    css={`
      display: flex;
      flex-direction: column;
      padding-top: 24px;
      justify-content: space-between;
      height: 100%;
    `}
  >
    <div
      css={`
        flex-grow: 2;
        margin-bottom: 20px;
      `}
    >
      <img
        alt=""
        src={icon}
        width="56"
        height="56"
        css={`
          display: block;
          margin: 0 auto 20px;
          width: 56px;
          height: 56px;
        `}
      />
      <h1
        css={`
          text-align: center;
          margin-bottom: 8px;
          ${font({ size: 'large', weight: 'bold' })};
        `}
      >
        {name}
      </h1>
      {canUpgrade && (
        <div
          css={`
            display: flex;
            justify-content: center;
            margin-bottom: 12px;
          `}
        >
          <Badge
            background={color(theme.positive)
              .alpha(0.15)
              .cssa()}
            foreground={theme.positive}
          >
            New version available
          </Badge>
        </div>
      )}
      <p
        css={`
          margin-bottom: 8px;
          text-align: center;
        `}
      >
        {description}
      </p>
    </div>
    <div>
      <Button
        mode={canUpgrade ? 'strong' : 'outline'}
        onClick={() => onOpen(appName)}
        wide
      >
        {canUpgrade ? 'Upgrade' : 'View details'}
      </Button>
    </div>
  </section>
)

AppCardContent.propTypes = {
  app: PropTypes.shape({
    appName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    description: PropTypes.string.isRequired,
    canUpgrade: PropTypes.bool,
  }).isRequired,
  onOpen: PropTypes.func.isRequired,
}

export default AppCardContent
