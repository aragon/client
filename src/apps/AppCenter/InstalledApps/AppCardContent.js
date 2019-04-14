import React from 'react'
import PropTypes from 'prop-types'
import color from 'onecolor'
import { Badge, Button, font, theme } from '@aragon/ui'
import defaultAppIcon from '../../../assets/default-app-icon.svg'
import RemoteImage from '../../../components/RemoteImage'
import { RepoType } from '../../../prop-types'
import { appIconUrl } from '../../../utils'

const AppCardContent = ({ repo, onOpen }) => {
  const { name, repoName, baseUrl, currentVersion, latestVersion } = repo
  const { description, icons } = latestVersion.content
  const canUpgrade = currentVersion.version !== latestVersion.version
  const iconUrl = appIconUrl({ baseUrl, icons })
  return (
    <section
      css={`
        display: flex;
        flex-direction: column;
        height: 100%;
        padding-top: 24px;
        justify-content: space-between;
      `}
    >
      <div
        css={`
          flex-grow: 2;
          margin-bottom: 20px;
        `}
      >
        <RemoteImage src={iconUrl}>
          {({ exists }) => (
            <img
              alt=""
              src={exists ? iconUrl : defaultAppIcon}
              width="56"
              height="56"
              css={`
                display: block;
                margin: 0 auto 20px;
                width: 56px;
                height: 56px;
              `}
            />
          )}
        </RemoteImage>
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
          onClick={() => onOpen(repoName)}
          wide
        >
          {canUpgrade ? 'Upgrade' : 'View details'}
        </Button>
      </div>
    </section>
  )
}

AppCardContent.propTypes = {
  repo: RepoType.isRequired,
  onOpen: PropTypes.func.isRequired,
}

export default AppCardContent
