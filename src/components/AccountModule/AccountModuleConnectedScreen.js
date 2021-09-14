import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Button,
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
import { EthereumAddressType, EthereumProviderType } from '../../prop-types'
import { useCopyToClipboard } from '../../copy-to-clipboard'
import { useWallet } from '../../contexts/wallet'
import {
  useNetworkConnectionData,
  useSyncState,
  useWalletConnectionDetails,
} from './connection-hooks'
import WalletSyncedInfo from './WalletSyncedInfo'
import { trackEvent, events } from '../../analytics'

function AccountModuleConnectedScreen({
  account,
  clientListening,
  clientOnline,
  clientSyncDelay,
  providerInfo,
  walletListening,
  walletOnline,
  walletSyncDelay,
}) {
  const wallet = useWallet()
  const theme = useTheme()

  const {
    walletNetworkName,
    walletNetworkFullName,
    isWrongNetwork,
  } = useNetworkConnectionData()

  const copyAddress = useCopyToClipboard(account, 'Address copied')

  const { header, info, status } = useSyncState(
    clientListening,
    walletListening,
    clientOnline,
    clientSyncDelay,
    walletSyncDelay
  )
  const { connectionMessage, connectionColor } = useWalletConnectionDetails(
    clientListening,
    walletListening,
    clientOnline,
    walletOnline,
    clientSyncDelay,
    walletSyncDelay,
    walletNetworkName
  )

  const handleDisconnect = useCallback(() => {
    // analytics test
    trackEvent(events.WALLET_DISCONNECTED, {
      wallet_address: wallet.account,
      wallet_provider: wallet.providerInfo.name,
      network: wallet.networkType,
    })

    wallet.reset()
  }, [wallet])

  const Icon = connectionColor !== theme.positive ? IconCross : IconCheck

  const formattedConnectionMessage = connectionMessage.includes('Connected')
    ? `Connected to ${walletNetworkFullName} Network`
    : connectionMessage

  return (
    <div
      css={`
        padding: ${2 * GU}px;
      `}
    >
      <FlexWrapper
        css={`
          width: 100%;
        `}
      >
        <FlexWrapper
          css={`
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
        </FlexWrapper>
        <FlexWrapper
          css={`
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
              padding: ${0.5 * GU}px;
              &:active {
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
        </FlexWrapper>
      </FlexWrapper>
      <FlexWrapper
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
            {formattedConnectionMessage}
          </span>
        )}
      </FlexWrapper>

      {isWrongNetwork ? (
        <div
          css={`
            margin-top: ${1 * GU}px;
          `}
        >
          Network error, please contact Aragon.
        </div>
      ) : (
        <WalletSyncedInfo header={header} info={info} status={status} />
      )}

      <Button
        onClick={handleDisconnect}
        wide
        css={`
          margin-top: ${1 * GU}px;
        `}
      >
        Disconnect wallet
      </Button>
    </div>
  )
}

AccountModuleConnectedScreen.propTypes = {
  account: EthereumAddressType,
  clientListening: PropTypes.bool,
  clientOnline: PropTypes.bool,
  clientSyncDelay: PropTypes.number,
  providerInfo: EthereumProviderType,
  walletListening: PropTypes.bool,
  walletOnline: PropTypes.bool,
  walletSyncDelay: PropTypes.number,
}

const FlexWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`

export default AccountModuleConnectedScreen
