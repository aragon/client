import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useWallet, WALLET_STATUS } from '../../contexts/wallet'
import { useLocalIdentity } from '../../hooks'
import {
  useNetworkConnectionData,
  useSyncInfo,
  useWalletConnectionDetails,
} from './connection-hooks'
import AccountModulePopover from './AccountModulePopover'
import ButtonConnect from './ButtonConnect'
import ButtonAccount from './ButtonAccount'

import ProvidersScreen from './AccountModuleProvidersScreen'
import ConnectingScreen from './AccountModuleConnectingScreen'
import ConnectedScreen from './AccountModuleConnectedScreen'
import ErrorScreen from './AccountModuleErrorScreen'

const SCREEN_ID = Object.freeze({
  providers: WALLET_STATUS.providers,
  connecting: WALLET_STATUS.connecting,
  connected: WALLET_STATUS.connected,
  error: WALLET_STATUS.error,
})

const SCREENS = [
  { id: SCREEN_ID.providers, title: 'Use account from' },
  { id: SCREEN_ID.connecting, title: 'Use account from' },
  { id: SCREEN_ID.connected, title: 'Active account' },
  { id: SCREEN_ID.error, title: 'Connection error' },
]

function AccountModule() {
  const [opened, setOpened] = useState(false)
  const [activatingDelayed, setActivatingDelayed] = useState(null)
  const buttonRef = useRef()
  const wallet = useWallet()

  const { account, error, status, providerInfo } = wallet

  const open = useCallback(() => setOpened(true), [])
  const toggle = useCallback(() => setOpened(opened => !opened), [])

  const handleResetConnection = useCallback(() => {
    wallet.reset()
  }, [wallet])

  const handleActivate = useCallback(providerId => wallet.connect(providerId), [
    wallet,
  ])

  const {
    clientConnectionStatus,
    clientListening,
    clientOnline,
    clientSyncDelay,
    connectionColor,
    connectionMessage,
    isWrongNetwork,
    label,
    walletConnectionStatus,
    walletListening,
    walletSyncDelay,
  } = useConnectionInfo()

  // Always show the “connecting…” screen, even if there are no delay
  useEffect(() => {
    let timer

    if (status === WALLET_STATUS.error) {
      setActivatingDelayed(null)
    }

    if (status === WALLET_STATUS.connecting) {
      setActivatingDelayed(providerInfo.id)
      timer = setTimeout(() => {
        setActivatingDelayed(null)
      }, 400)
    }

    return () => clearTimeout(timer)
  }, [providerInfo, status])

  const previousScreenIndex = useRef(-1)

  const { screenIndex, direction } = useMemo(() => {
    const screenId =
      status === WALLET_STATUS.disconnected ? SCREEN_ID.providers : status

    const screenIndex = SCREENS.findIndex(screen => screen.id === screenId)
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1

    previousScreenIndex.current = screenIndex

    return { direction, screenIndex }
  }, [status])

  const screen = SCREENS[screenIndex]
  const screenId = screen.id

  const handlePopoverClose = useCallback(() => {
    if (screenId === SCREEN_ID.connecting || screenId === SCREEN_ID.error) {
      // reject closing the popover
      return false
    }
    setOpened(false)
  }, [screenId])

  return (
    <div
      ref={buttonRef}
      css={`
        display: flex;
        align-items: center;
        height: 100%;
      `}
    >
      {screenId === SCREEN_ID.connected || isWrongNetwork ? (
        <ButtonAccount
          connectionColor={connectionColor}
          connectionMessage={connectionMessage}
          isWrongNetwork={isWrongNetwork}
          label={label}
          onClick={toggle}
        />
      ) : (
        <ButtonConnect onClick={toggle} />
      )}
      <AccountModulePopover
        direction={direction}
        heading={screen.title}
        keys={({ screenId }) => screenId + providerInfo.id + error.name}
        onClose={handlePopoverClose}
        onOpen={open}
        opener={buttonRef.current}
        screenId={screenId}
        screenData={{
          account,
          activating: activatingDelayed,
          activationError: error,
          providerInfo,
          screenId,
        }}
        screenKey={({
          account,
          activating,
          activationError,
          providerInfo,
          screenId,
        }) =>
          (activationError ? activationError.name : '') +
          account +
          activating +
          providerInfo.id +
          screenId
        }
        visible={opened}
      >
        {({ account, screenId, activating, activationError, providerInfo }) => {
          if (screenId === SCREEN_ID.connecting) {
            return (
              <ConnectingScreen
                providerId={activating}
                onCancel={handleResetConnection}
              />
            )
          }
          if (screenId === SCREEN_ID.connected) {
            return (
              <ConnectedScreen
                account={account}
                clientConnectionStatus={clientConnectionStatus}
                clientListening={clientListening}
                clientOnline={clientOnline}
                clientSyncDelay={clientSyncDelay}
                providerInfo={providerInfo}
                walletConnectionStatus={walletConnectionStatus}
                walletListening={walletListening}
                walletOnline={walletListening}
                walletSyncDelay={walletSyncDelay}
              />
            )
          }
          if (screenId === SCREEN_ID.error) {
            return (
              <ErrorScreen
                error={activationError}
                onBack={handleResetConnection}
              />
            )
          }
          return <ProvidersScreen onActivate={handleActivate} />
        }}
      </AccountModulePopover>
    </div>
  )
}

function useConnectionInfo() {
  const wallet = useWallet()
  const { name: label } = useLocalIdentity(wallet.account || '')

  const {
    isListening: walletListening,
    isOnline: walletOnline,
    connectionStatus: walletConnectionStatus,
    syncDelay: walletSyncDelay,
  } = useSyncInfo('wallet')

  const {
    isListening: clientListening,
    isOnline: clientOnline,
    connectionStatus: clientConnectionStatus,
    syncDelay: clientSyncDelay,
  } = useSyncInfo()

  const { walletNetworkName, isWrongNetwork } = useNetworkConnectionData()

  const { connectionMessage, connectionColor } = useWalletConnectionDetails(
    clientListening,
    walletListening,
    clientOnline,
    walletOnline,
    clientSyncDelay,
    walletSyncDelay,
    walletNetworkName
  )

  return {
    clientConnectionStatus,
    clientListening,
    clientOnline,
    clientSyncDelay,
    connectionColor,
    connectionMessage,
    isWrongNetwork,
    label,
    walletConnectionStatus,
    walletListening,
    walletNetworkName,
    walletOnline,
    walletSyncDelay,
  }
}

export default AccountModule
