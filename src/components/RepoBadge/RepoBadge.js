import React from 'react'
import { blockExplorerUrl, useTheme, GU, LinkBase, RADIUS } from '@aragon/ui'
import { network } from '../../environment'
import AppIcon from '../../components/AppIcon/AppIcon'
import { KNOWN_ICONS } from '../../repo-utils'
import { repoBaseUrl } from '../../url-utils'
import { RepoVersionType } from '../../prop-types'

function useRepoBadge(repoVersion) {
  const {
    content: { appId, contractAddress, name, icons },
  } = repoVersion

  return {
    baseUrl: repoBaseUrl(repoVersion),
    icons: icons,
    contractAddress,
    knownIcon: KNOWN_ICONS.has(appId) ? KNOWN_ICONS.get(appId) : null,
    name: name,
  }
}

const RepoBadge = React.memo(function({ repoVersion }) {
  const theme = useTheme()
  const { icons, baseUrl, contractAddress, knownIcon, name } = useRepoBadge(
    repoVersion
  )

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
          background: #daeaef;
          border-radius: ${RADIUS}px;
          align-items: center;
          height: ${3 * GU}px;
          align-items: center;
          text-decoration: none;
          width: 100%;
        `}
      >
        <AppIcon
          app={{ baseUrl, icons }}
          src={knownIcon || undefined}
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
