import React from 'react'
import PropTypes from 'prop-types'
import {
  ButtonBase,
  GU,
  IconCheck,
  IconCopy,
  IconCross,
  IdentityBadge,
  RADIUS,
  textStyle,
  useTheme,
} from '@aragon/ui'

import { useCopyToClipboard } from '../../copy-to-clipboard'
import { useWallet } from '../../wallet'
import {
  useNetworkConnectionData,
  useWalletConnectionDetails,
} from './connection-hooks'
import WalletSyncedInfo from './WalletSyncedInfo'

function WalletConnectionInfo({
  clientListening,
  clientOnline,
  clientSyncDelay,
  locator,
  walletListening,
  walletOnline,
  walletSyncDelay,
}) {
  const { account, providerInfo } = useWallet()
  const theme = useTheme()

  const {
    walletNetworkName,
    clientNetworkName,
    hasNetworkMismatch,
  } = useNetworkConnectionData()

  const copyAddress = useCopyToClipboard(account, 'Address copied')

  const { connectionMessageLong, connectionColor } = useWalletConnectionDetails(
    clientListening,
    walletListening,
    clientOnline,
    walletOnline,
    clientSyncDelay,
    walletSyncDelay,
    walletNetworkName
  )

  const Icon = connectionColor !== theme.positive ? IconCross : IconCheck

  return (
    <section
      css={`
        max-width: ${51 * GU}px;
      `}
    >
      <h1
        css={`
          display: flex;
          align-items: center;
          height: ${4 * GU}px;
          padding: 0 ${2 * GU}px;
          ${textStyle('label2')};
          color: ${theme.surfaceContentSecondary};
          border-bottom: 1px solid ${theme.border};
        `}
      >
        Ethereum connection
      </h1>

      <div
        css={`
          padding: ${2 * GU}px;
        `}
      >
        <div
          css={`
            display: inline-flex;
            align-items: center;
            width: 100%;
          `}
        >
          <div
            css={`
              display: inline-flex;
              align-items: center;
              margin-right: ${3 * GU}px;
            `}
          >
            <img
              src={providerInfo.image}
              alt=""
              css={`
                width: ${2.5 * GU}px;
                height: ${2.5 * GU}px;
                margin-right: ${0.5 * GU}px;
                transform: translateY(-2px);
              `}
            />
            <span>{providerInfo.name}</span>
          </div>
          <div
            css={`
              display: inline-flex;
              align-items: center;
              width: 100%;
              justify-content: flex-end;
            `}
          >
            <ButtonBase
              onClick={copyAddress}
              focusRingRadius={RADIUS}
              css={`
                display: flex;
                align-items: center;
                justify-self: flex-end;
                  background: ${theme.surfacePressed};
                }
              `}
            >
              <IdentityBadge
                entity={account}
                compact
                badgeOnly
                css="cursor: pointer"
              />
              <IconCopy
                css={`
                  color: ${theme.hint};
                `}
              />
            </ButtonBase>
          </div>
        </div>
        <div
          css={`
            display: flex;
            margin-top: ${1 * GU}px;
            color: ${connectionColor};
            ${textStyle('label2')};
          `}
        >
          <Icon size="small" />
          {walletNetworkName && (
            <span
              css={`
                margin-left: ${0.5 * GU}px;
              `}
            >
              {connectionMessageLong}
            </span>
          )}
        </div>

        {hasNetworkMismatch ? (
          <div
            css={`
              margin-top: ${1 * GU}px;
            `}
          >
            Please connect to the Ethereum {clientNetworkName} Network.
          </div>
        ) : (
          <WalletSyncedInfo
            clientListening={clientListening}
            clientOnline={clientOnline}
            clientSyncDelay={clientSyncDelay}
            locator={locator}
            walletListening={walletListening}
            walletSyncDelay={walletSyncDelay}
          />
        )}
      </div>
    </section>
  )
}

WalletConnectionInfo.propTypes = {
  clientListening: PropTypes.bool,
  clientOnline: PropTypes.bool,
  clientSyncDelay: PropTypes.number,
  locator: PropTypes.object,
  walletListening: PropTypes.bool,
  walletOnline: PropTypes.bool,
  walletSyncDelay: PropTypes.number,
}

export default WalletConnectionInfo
