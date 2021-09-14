import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Card, Tag, textStyle, unselectable, GU } from '@aragon/ui'
import { AppType } from '../../prop-types'
import { shortenAddress } from '../../util/web3'
import AppIcon from '../AppIcon/AppIcon'

const AppCard = React.memo(function AppCard({ onOpen, app }) {
  const {
    name,
    identifier,
    isAragonOsInternalApp,
    hasWebApp,
    proxyAddress,
  } = app

  const onClick = useCallback(() => {
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
          max-width: 100%;
          padding: 0 ${1 * GU}px ${1 * GU}px;
          span {
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          ${textStyle('body2')}
        `}
      >
        <span>{name || 'Unknown'}</span>
      </p>
      <div
        css={`
          max-width: 100%;
          padding: 0 ${2 * GU}px;
        `}
      >
        <Tag mode="identifier" label={instanceLabel} title={instanceTitle} />
      </div>
    </Card>
  )
})

AppCard.propTypes = {
  app: AppType.isRequired,
  onOpen: PropTypes.func.isRequired,
}

export default AppCard
