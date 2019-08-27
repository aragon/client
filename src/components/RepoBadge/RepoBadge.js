import React, { useMemo } from 'react'
import { blockExplorerUrl, useTheme, GU, Link, RADIUS } from '@aragon/ui'
import { network } from '../../environment'
import AppIcon from '../../components/AppIcon/AppIcon'
import { KNOWN_ICONS, isKnownRepo } from '../../repo-utils'
import { repoBaseUrl, sanitizeCodeRepositoryUrl } from '../../url-utils'

function useRepoBadge(repo) {
  const {
    content: { appId, contractAddresses, name, icons },
    version,
  } = repo

  return {
    baseUrl: repoBaseUrl(repo),
    icons: icons,
    contractAddress: contractAddresses,
    knownIcon: KNOWN_ICONS.has(appId) ? KNOWN_ICONS.get(appId) : null,
    name: name,
  }
}

const RepoBadge = ({ repo }) => {
  const theme = useTheme()
  const { baseUrl, icons, contractAddress, knownIcon, name } = useRepoBadge(
    repo
  )

  return (
    <div
      css={`
        display: inline-flex;
        align-items: center;
        min-width: 0;
      `}
    >
      <Link
        target="_blank"
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
            min-width: 22px;
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
      </Link>
    </div>
  )
}

export default RepoBadge
