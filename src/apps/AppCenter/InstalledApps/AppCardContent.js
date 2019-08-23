import React from 'react'
import { GU, Tag, unselectable, useTheme, textStyle } from '@aragon/ui'
import AppIcon from '../../../components/AppIcon/AppIcon'
import { RepoType } from '../../../prop-types'

const AppCardContent = ({ repo, compactMode }) => {
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
        height: 100%;
        width: 100%;

        ${compactMode
          ? `
              display: grid;
              grid-template-columns: auto 1fr;
              grid-template-rows: auto 1fr 1fr;
              grid-template-areas:
                "tag tag"
                "icon title"
                "icon description";
              padding: ${1.5 * GU}px ${1.5 * GU}px ${4 * GU}px ${3 * GU}px;
            `
          : `
              display: flex;
              flex-direction: column;
              align-items: center;
              padding-top: ${5 * GU}px;
            `}
      `}
    >
      <div
        css={`
          height: ${9 * GU}px;
          width: ${9 * GU}px;
          ${compactMode
            ? `
                grid-area: icon;
                margin-right: ${1.5 * GU}px;
              `
            : `
                margin-bottom: ${2 * GU}px;
              `}
        `}
      >
        <AppIcon app={{ baseUrl, icons }} size={9 * GU} radius={12} />
      </div>
      <p
        css={`
          display: flex;
          width: 100%;
          ${textStyle('title4')}
          ${compactMode
            ? `
                grid-area: title;
                align-self: flex-end;
              `
            : `
                justify-content: center;
                margin-bottom: ${1 * GU}px;
              `}
        `}
      >
        {name}
      </p>
      <div
        css={`
          ${compactMode
            ? `
                grid-area: tag;
                text-align: right;
              `
            : `
                max-width: 100%;
                padding: 0 ${2.5 * GU}px;
                margin-bottom: ${1 * GU}px;
              `}
        `}
      >
        <Tag mode={canUpgrade ? 'new' : 'indicator'}>
          {canUpgrade ? 'New version' : 'Up to date'}
        </Tag>
      </div>
      <p
        css={`
          color: ${theme.contentSecondary};
          ${textStyle('body2')};
          ${compactMode
            ? `
                grid-area: description;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                height: fit-content;
              `
            : `
                flex: 1;
                text-align: center;
                padding: 0 1rem;
              `}
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
