import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useWallet } from '../../wallet'
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

const SCREENS = [
  { id: 'providers', title: 'Use account from' },
  { id: 'connecting', title: 'Use account from' },
  { id: 'connected', title: 'Active account' },
  { id: 'error', title: 'Connection error' },
]

function AccountModule() {
  const [opened, setOpened] = useState(false)
  const [activatingDelayed, setActivatingDelayed] = useState(false)
  const [activationError, setActivationError] = useState(null)
  const buttonRef = useRef()
  const wallet = useWallet()

  const { account, activating, providerInfo } = wallet

  const clearError = useCallback(() => setActivationError(null), [])

  const open = useCallback(() => setOpened(true), [])
  const toggle = useCallback(() => setOpened(opened => !opened), [])

  const handleCancelConnection = useCallback(() => {
    wallet.deactivate()
  }, [wallet])

  const handleActivate = useCallback(
    async providerId => {
      try {
        await wallet.activate(providerId)
      } catch (error) {
        setActivationError(error)
      }
    },
    [wallet]
  )

  const {
    clientConnectionStatus,
    clientListening,
    clientOnline,
    clientSyncDelay,
    connectionColor,
    connectionMessage,
    hasNetworkMismatch,
    label,
    walletConnectionStatus,
    walletListening,
    walletSyncDelay,
  } = useConnectionInfo()

  // Always show the “connecting…” screen, even if there are no delay
  useEffect(() => {
    if (activationError) {
      setActivatingDelayed(null)
    }

    if (activating) {
      setActivatingDelayed(activating)
      return
    }

    const timer = setTimeout(() => {
      setActivatingDelayed(null)
    }, 400)

    return () => clearTimeout(timer)
  }, [activating, activationError])

  const previousScreenIndex = useRef(-1)

  const { screenIndex, direction } = useMemo(() => {
    const screenId = (() => {
      if (activationError) {
        return 'error'
      }
      if (activatingDelayed) {
        return 'connecting'
      }
      if (account) {
        return 'connected'
      }
      return 'providers'
    })()

    const screenIndex = SCREENS.findIndex(screen => screen.id === screenId)
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1

    previousScreenIndex.current = screenIndex

    return { direction, screenIndex }
  }, [account, activationError, activatingDelayed])

  const screen = SCREENS[screenIndex]
  const screenId = screen.id

  const handlePopoverClose = useCallback(() => {
    if (screenId === 'connecting' || screenId === 'error') {
      // reject closing the popover
      return false
    }
    setOpened(false)
    setActivationError(null)
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
      {screenId === 'connected' ? (
        <ButtonAccount
          connectionColor={connectionColor}
          connectionMessage={connectionMessage}
          hasNetworkMismatch={hasNetworkMismatch}
          label={label}
          onClick={toggle}
        />
      ) : (
        <ButtonConnect onClick={toggle} />
      )}
      <AccountModulePopover
        direction={direction}
        heading={screen.title}
        keys={({ screenId }) => screenId + activating + activationError.name}
        onClose={handlePopoverClose}
        onOpen={open}
        opener={buttonRef.current}
        screenId={screenId}
        screenData={{
          account,
          activating: activatingDelayed,
          activationError,
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
          if (screenId === 'connecting') {
            return (
              <ConnectingScreen
                providerId={activating}
                onCancel={handleCancelConnection}
              />
            )
          }
          if (screenId === 'connected') {
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
          if (screenId === 'error') {
            return <ErrorScreen error={activationError} onBack={clearError} />
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

  const { walletNetworkName, hasNetworkMismatch } = useNetworkConnectionData()

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
    hasNetworkMismatch,
    label,
    walletConnectionStatus,
    walletListening,
    walletNetworkName,
    walletOnline,
    walletSyncDelay,
  }
}

export default AccountModule
