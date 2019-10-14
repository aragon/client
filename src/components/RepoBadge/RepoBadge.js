import React from 'react'
import { LinkBase, GU, RADIUS, blockExplorerUrl, useTheme } from '@aragon/ui'
import { network } from '../../environment'
import AppIcon from '../../components/AppIcon/AppIcon'
import { repoBaseUrl } from '../../url-utils'
import { RepoVersionType } from '../../prop-types'

const RepoBadge = React.memo(function({ repoVersion }) {
  const theme = useTheme()
  const {
    content: { appId, contractAddress, name, icons },
  } = repoVersion
  const baseUrl = repoBaseUrl(appId, repoVersion)

  return (
    <div
      css={`
        display: inline-flex;
        align-items: center;
        min-width: 0;
      `}
    >
      <LinkBase
        focusRingSpacing={0}
        external
        href={blockExplorerUrl('address', contractAddress, {
          networkType: network.type,
        })}
        css={`
          display: flex;
          background: ${theme.badge};
          color: ${theme.badgeContent};
          border-radius: ${RADIUS}px;
          align-items: center;
          height: ${3 * GU}px;
          align-items: center;
          text-decoration: none;
          width: 100%;
        `}
      >
        <AppIcon
          app={{ appId, baseUrl, icons }}
          radius={RADIUS}
          css={`
            min-width: ${3 * GU}px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          `}
        />
        <div
          css={`
            padding: 0 5px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: ${theme.content};
          `}
        >
          {name}
        </div>
      </LinkBase>
    </div>
  )
})

RepoBadge.propTypes = {
  repoVersion: RepoVersionType.isRequired,
}

export default RepoBadge
