import React from 'react'
import { GU, Tag, unselectable, useTheme, textStyle } from '@aragon/ui'
import AppIcon from '../../../components/AppIcon/AppIcon'
import { RepoType } from '../../../prop-types'

const AppCardContent = ({ repo }) => {
  const theme = useTheme()
  const { name, baseUrl, currentVersion, latestVersion } = repo
  const { description, icons } = latestVersion.content
  const canUpgrade = currentVersion.version !== latestVersion.version

  return (
    <section
      css={`
        ${unselectable};
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: ${5 * GU}px;
        height: 100%;
        width: 100%;
      `}
    >
      <div
        css={`
          height: ${9 * GU}px;
          margin-bottom: ${2 * GU}px;
          img {
            display: block;
          }
        `}
      >
        <AppIcon app={{ baseUrl, icons }} size={9 * GU} />
      </div>
      <p
        css={`
          display: flex;
          width: 100%;
          justify-content: center;
          margin-bottom: ${1 * GU}px;
          ${textStyle('title4')}
        `}
      >
        {name}
      </p>
      <div
        css={`
          max-width: 100%;
          padding: 0 ${2.5 * GU}px;
          margin-bottom: ${1 * GU}px;
        `}
      >
        <Tag mode={canUpgrade ? 'new' : 'indicator'}>
          {canUpgrade ? 'New version' : 'Up to date'}
        </Tag>
      </div>
      <p
        css={`
          color: ${theme.contentSecondary};
          padding: 0 1rem;
          text-align: center;
          ${textStyle('body2')};
          flex: 1;
        `}
      >
        {description}
      </p>
    </section>
  )
}

AppCardContent.propTypes = {
  repo: RepoType.isRequired,
}

export default AppCardContent
