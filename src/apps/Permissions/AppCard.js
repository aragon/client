import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Card, Badge, unselectable, GU } from '@aragon/ui'
import { AppType } from '../../prop-types'
import { shortenAddress } from '../../web3-utils'
import AppIcon from '../../components/AppIcon/AppIcon'

const AppBadge = Badge.App

const AppCard = React.memo(function AppCard({ onOpen, app }) {
  const {
    name,
    identifier,
    isAragonOsInternalApp,
    hasWebApp,
    proxyAddress,
  } = app

  const onClick = useCallback(() => {
    console.log('open', proxyAddress)
    onOpen(proxyAddress)
  }, [onOpen, proxyAddress])

  const instanceTitle = `Address: ${proxyAddress}`
  const instanceLabel = isAragonOsInternalApp
    ? 'System App'
    : !hasWebApp
    ? 'Background App'
    : identifier || shortenAddress(proxyAddress)

  return (
    <Card
      onClick={onClick}
      css={`
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-top: ${3 * GU}px;
        cursor: pointer;
        ${unselectable};
      `}
    >
      <div
        css={`
          margin-bottom: ${1 * GU}px;
        `}
      >
        <AppIcon app={app} size={7 * GU} />
      </div>
      <p
        css={`
          display: flex;
          justify-content: center;
          max-width: calc(100% - 20px);
          margin: 0 ${1 * GU}px ${1 * GU}px;
          span {
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        `}
      >
        <span>{name || 'Unknown'}</span>
      </p>
      <div
        css={`
          max-width: 100%;
          padding: 0 20px;
          margin-bottom: 10px;
        `}
      >
        <AppBadge
          title={instanceTitle}
          css={`
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
          `}
        >
          {instanceLabel}
        </AppBadge>
      </div>
    </Card>
  )
})

AppCard.propTypes = {
  app: AppType.isRequired,
  onOpen: PropTypes.func.isRequired,
}

export default AppCard
