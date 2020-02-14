import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { GU, springs } from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import { useWallet } from '../../wallet'
import { useLocalIdentity } from '../../hooks'
import { useSyncInfo } from './useSyncInfo'
import { useNetworkConnectionData, useWalletConnectionDetails } from './utils'

import ProvidersScreen from './AccountModuleProvidersScreen'
import ConnectingScreen from './AccountModuleConnectingScreen'
import ConnectedScreen from './AccountModuleConnectedScreen'
import ErrorScreen from './AccountModuleErrorScreen'

import AccountModulePopover from './AccountModulePopover'
import ButtonConnect from './ButtonConnect'
import ButtonAccount from './ButtonAccount'

const AnimatedDiv = animated.div

const SCREENS = [
  {
    id: 'providers',
    title: 'Use account from',
    height: 38 * GU,
  },
  {
    id: 'connecting',
    title: 'Use account from',
    height: 38 * GU,
  },
  {
    id: 'connected',
    title: 'Active account',
    height: 32 * GU,
  },
  {
    id: 'error',
    title: 'Connection error',
    height: 50 * GU,
  },
]

function AccountModule({ locator }) {
  const buttonRef = useRef()
  const wallet = useWallet()
  const [opened, setOpened] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [activatingDelayed, setActivatingDelayed] = useState(false)
  const [activationError, setActivationError] = useState(null)

  const { account, activating } = wallet

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

  // Don’t animate the slider until the popover has opened
  useEffect(() => {
    if (!opened) {
      return
    }
    setAnimate(false)
    const timer = setTimeout(() => {
      setAnimate(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [opened])

  // Always show the “connecting…” screen, even if there are no delay
  useEffect(() => {
    if (activating) {
      setActivatingDelayed(activating)
      return
    }

    const timer = setTimeout(() => {
      setActivatingDelayed(null)
    }, 500)
    return () => {
      clearTimeout(timer)
    }
  }, [activating])

  const previousScreenIndex = useRef(-1)

  const { screenIndex, direction } = useMemo(() => {
    const screenId = (() => {
      if (activationError) return 'error'
      if (activatingDelayed) return 'connecting'
      if (account) return 'connected'
      return 'providers'
    })()

    const screenIndex = SCREENS.findIndex(screen => screen.id === screenId)
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1

    previousScreenIndex.current = screenIndex

    return { direction, screenIndex }
  }, [account, activationError, activatingDelayed])

  const screen = SCREENS[screenIndex]
  const screenId = screen.id

  const handlePopoverClose = useCallback(
    reject => {
      if (screenId === 'connecting' || screenId === 'error') {
        // reject closing the popover
        return false
      }
      setOpened(false)
      setActivationError(null)
    },
    [screenId]
  )

  return (
    <div
      ref={buttonRef}
      css={`
        display: flex;
        align-items: center;
        height: 100%;
      `}
    >
      {screen.id === 'connected' ? (
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
        animateHeight={animate}
        heading={screen.title}
        height={screen.height}
        onClose={handlePopoverClose}
        onOpen={open}
        opener={buttonRef.current}
        screenId={screenId}
        visible={opened}
      >
        <Transition
          native
          immediate={!animate}
          config={springs.smooth}
          items={{ screen, activating: activatingDelayed }}
          keys={({ screen }) => screen.id + activatingDelayed}
          from={{
            opacity: 0,
            transform: `translate3d(${3 * GU * direction}px, 0, 0)`,
          }}
          enter={{ opacity: 1, transform: `translate3d(0, 0, 0)` }}
          leave={{
            opacity: 0,
            transform: `translate3d(${3 * GU * -direction}px, 0, 0)`,
          }}
        >
          {({ screen, activating }) => ({ opacity, transform }) => (
            <AnimatedDiv
              style={{ opacity, transform }}
              css={`
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
              `}
            >
              {(() => {
                if (screen.id === 'connecting') {
                  return (
                    <ConnectingScreen
                      providerId={activating}
                      onCancel={handleCancelConnection}
                    />
                  )
                }
                if (screen.id === 'connected') {
                  return (
                    <ConnectedScreen
                      clientListening={clientListening}
                      clientOnline={clientOnline}
                      clientConnectionStatus={clientConnectionStatus}
                      clientSyncDelay={clientSyncDelay}
                      locator={locator}
                      walletListening={walletListening}
                      walletOnline={walletListening}
                      walletConnectionStatus={walletConnectionStatus}
                      walletSyncDelay={walletSyncDelay}
                    />
                  )
                }
                if (screen.id === 'error') {
                  return <ErrorScreen onBack={clearError} />
                }
                return <ProvidersScreen onActivate={handleActivate} />
              })()}
            </AnimatedDiv>
          )}
        </Transition>
      </AccountModulePopover>
    </div>
  )
}
AccountModule.propTypes = {
  locator: PropTypes.object,
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
