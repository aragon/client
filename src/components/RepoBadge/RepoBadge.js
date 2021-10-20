import React from 'react'
import { LinkBase, GU, RADIUS, useTheme } from '@aragon/ui'
import AppIcon from '../../components/AppIcon/AppIcon'
import { repoBaseUrl } from '../../util/url'
import { RepoVersionType } from '../../prop-types'
import { useWallet } from '../../contexts/wallet'
import { blockExplorerUrl } from 'use-wallet'
import { getChainId } from '../../util/network'

const RepoBadge = React.memo(function RepoBadge({
  displayVersion,
  latestVersion,
}) {
  const theme = useTheme()
  const { networkType } = useWallet()

  // If content from the display version isn't available, default to using the latest version
  const version = displayVersion || latestVersion
  const {
    content: { appId, contractAddress, name, icons },
  } = version
  const baseUrl = repoBaseUrl(appId, version, networkType)

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
        href={blockExplorerUrl(
          'address',
          contractAddress,
          getChainId(networkType)
        )}
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
  displayVersion: RepoVersionType,
  latestVersion: RepoVersionType.isRequired,
}

export default RepoBadge
