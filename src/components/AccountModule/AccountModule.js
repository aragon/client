import React, { useCallback, useEffect, useRef, useState } from 'react'
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
    title: 'Ethereum providers',
    height: 38 * GU,
  },
  {
    id: 'connecting',
    title: 'Ethereum providers',
    height: 38 * GU,
  },
  {
    id: 'connected',
    title: 'Active wallet',
    height: 32 * GU,
  },
  {
    id: 'error',
    title: 'Ethereum providers',
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
  const [direction, setDirection] = useState(1)
  const [screenIndex, setScreenIndex] = useState(0)

  const { account, activating } = wallet

  const updateScreen = useCallback(
    id => {
      const newScreenIndex = SCREENS.findIndex(screen => screen.id === id)
      if (newScreenIndex > -1 && newScreenIndex !== screenIndex) {
        setDirection(screenIndex > newScreenIndex ? -1 : 1)
        setScreenIndex(newScreenIndex)
      }
    },
    [screenIndex]
  )

  const screen = SCREENS[screenIndex]

  const clearError = useCallback(() => setActivationError(null), [])
  const close = useCallback(() => {
    setOpened(false)
    setActivationError(null)
  }, [])
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

  useEffect(() => {
    if (activationError) {
      return updateScreen('error')
    }
    if (activatingDelayed) {
      return updateScreen('connecting')
    }
    if (account) {
      return updateScreen('connected')
    }
    return updateScreen('providers')
  }, [account, activationError, activatingDelayed, updateScreen])

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
        onClose={close}
        onOpen={open}
        opener={buttonRef.current}
        screenId={screen.id}
        visible={opened || screen.id === 'connecting' || screen.id === 'error'}
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
