import React from 'react'
import PropTypes from 'prop-types'
import { Tag, GU, useViewport } from '@aragon/ui'
import { AppType, EthereumAddressType } from '../prop-types'
import { shortenAddress } from '../util/web3'
import AppIcon from './AppIcon/AppIcon'

const AppInstanceLabel = React.memo(
  ({ app, proxyAddress, showIcon = true }) => {
    const { above } = useViewport()

    return (
      <div
        css={`
          display: inline-flex;
          ${above('medium') &&
            `
              display: flex;
              align-items: center;
              text-align: left;
              margin: unset;
            `}
        `}
      >
        {above('medium') && showIcon && (
          <div
            css={`
              display: flex;
              align-items: center;
              height: 0;
              margin-right: 10px;
              margin-top: -1px;
            `}
          >
            <AppIcon app={app} />
          </div>
        )}
        <span
          css={`
            display: block;
            ${above('medium') &&
              `
                display: inline;
                margin-right: ${1 * GU}px;
              `}
          `}
        >
          {app ? app.name : 'Unknown'}
        </span>
        <Tag
          mode="identifier"
          label={(app && app.identifier) || shortenAddress(proxyAddress)}
          title={proxyAddress}
          css={`
            margin-left: ${1 * GU}px;
          `}
        />
      </div>
    )
  }
)

AppInstanceLabel.propTypes = {
  app: AppType.isRequired,
  proxyAddress: EthereumAddressType.isRequired,
  showIcon: PropTypes.bool,
}

export default AppInstanceLabel
