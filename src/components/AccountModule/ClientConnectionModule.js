import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonBase,
  Popover,
  GU,
  IconDown,
  textStyle,
  springs,
  useTheme,
  unselectable,
  useViewport,
} from '@aragon/ui'
import { animated, Spring } from 'react-spring'
import ClientConnectionInfo from './ClientConnectionInfo'
import {
  getConnectionMessage,
  useConnectionStatusColor,
  useNetworkConnectionData,
} from './utils'
import { CONNECTION_STATUS_ERROR, useSyncInfo } from './useSyncInfo'

// This is to avoid unnecessarily displaying the Client Connection Module
// if the user has a wallet connected.
const ACCOUNT_MODULE_DISPLAY_DELAY = 500

const AnimatedDiv = animated.div

function ClientConnectionModule() {
  const [opened, setOpened] = useState(false)
  const [display, setDisplay] = useState(false)
  const {
    isListening: listening,
    isOnline: online,
    connectionStatus,
    syncDelay,
  } = useSyncInfo()
  const { clientNetworkName } = useNetworkConnectionData()
  const { below } = useViewport()
  const close = () => setOpened(false)
  const toggle = () => setOpened(opened => !opened)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplay(true)
    }, ACCOUNT_MODULE_DISPLAY_DELAY)

    return () => clearTimeout(timer)
  }, [])

  if (!display) {
    return null
  }

  return (
    <Spring
      from={{ opacity: 0, scale: 0.96 }}
      to={{ opacity: 1, scale: 1 }}
      config={springs.swift}
      native
    >
      {({ opacity, scale }) => (
        <AnimatedDiv
          style={{
            opacity,
            transform: scale.interpolate(v => `scale3d(${v}, ${v}, 1)`),
          }}
          css={`
            display: flex;
            height: 100%;
            align-items: center;
          `}
        >
          {below('medium') ? (
            <MobileConnectionDetails
              connectionStatus={connectionStatus}
              clientNetworkName={clientNetworkName}
              close={close}
              listening={listening}
              online={online}
              syncDelay={syncDelay}
              toggle={toggle}
              opened={opened}
            />
          ) : (
            <ConnectionDetails
              connectionStatus={connectionStatus}
              clientNetworkName={clientNetworkName}
              close={close}
              listening={listening}
              online={online}
              syncDelay={syncDelay}
              toggle={toggle}
              opened={opened}
            />
          )}
        </AnimatedDiv>
      )}
    </Spring>
  )
}

function ConnectionDetails({
  clientNetworkName,
  close,
  connectionStatus,
  listening,
  online,
  opened,
  syncDelay,
  toggle,
}) {
  const containerRef = useRef()
  const theme = useTheme()
  const connectionColor = useConnectionStatusColor(
    listening && online ? status : CONNECTION_STATUS_ERROR
  )
  const connectionMessage = getConnectionMessage(
    connectionStatus,
    listening,
    online,
    clientNetworkName
  )

  return (
    <div
      ref={containerRef}
      css={`
        display: flex;
        height: 100%;
        ${unselectable};
      `}
    >
      <ButtonBase
        onClick={toggle}
        css={`
          display: flex;
          align-items: center;
          text-align: left;
          padding: 0 ${1 * GU}px;
          &:active {
            background: ${theme.surfacePressed};
          }
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            text-align: left;
            padding: 0 ${1 * GU}px 0 ${2 * GU}px;
          `}
        >
          <div css="position: relative">
            <div
              css={`
                position: absolute;
                bottom: -3px;
                right: -3px;
                width: 10px;
                height: 10px;
                background: ${connectionColor};
                border: 2px solid ${theme.surface};
                border-radius: 50%;
              `}
            />
          </div>
          <div
            css={`
              padding-left: ${1 * GU}px;
              padding-right: ${0.5 * GU}px;
            `}
          >
            <div
              css={`
                margin-bottom: -5px;
                ${textStyle('body2')}
              `}
            >
              <div
                css={`
                  overflow: hidden;
                  max-width: ${16 * GU}px;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                `}
              >
                Connection
              </div>
            </div>
            <div
              css={`
                font-size: 11px; /* doesn’t exist in aragonUI */
                color: ${connectionColor};
              `}
            >
              {connectionMessage}
            </div>
          </div>

          <IconDown
            size="small"
            css={`
              color: ${theme.surfaceIcon};
            `}
          />
        </div>
      </ButtonBase>
      <Popover
        closeOnOpenerFocus
        onClose={close}
        opener={containerRef.current}
        placement="bottom-end"
        visible={opened}
        css={`
          width: 410px;
        `}
      >
        <ClientConnectionInfo
          connectionStatus={connectionStatus}
          listening={listening}
          online={online}
          syncDelay={syncDelay}
        />
      </Popover>
    </div>
  )
}

ConnectionDetails.propTypes = {
  connectionStatus: PropTypes.symbol,
  clientNetworkName: PropTypes.string,
  close: PropTypes.func,
  listening: PropTypes.bool,
  online: PropTypes.bool,
  opened: PropTypes.bool,
  syncDelay: PropTypes.number,
  toggle: PropTypes.func,
}

function MobileConnectionDetails({
  clientNetworkName,
  close,
  connectionStatus,
  listening,
  online,
  opened,
  syncDelay,
  toggle,
}) {
  const containerRef = useRef()
  const theme = useTheme()
  const connectionColor = useConnectionStatusColor(
    listening && online ? status : CONNECTION_STATUS_ERROR
  )

  return (
    <div
      ref={containerRef}
      css={`
        display: flex;
        align-items: center;
        height: 100%;
        ${unselectable};
      `}
    >
      <Button
        onClick={toggle}
        size="medium"
        css={`
          display: flex;
          align-items: center;
          text-align: left;
          padding: 0 ${1 * GU}px;
          &:active {
            background: ${theme.surfacePressed};
          }
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            text-align: left;
            padding: 0 ${1 * GU}px 0 ${2 * GU}px;
          `}
        >
          <div css="position: relative">
            <div
              css={`
                position: absolute;
                bottom: -5px;
                right: -3px;
                width: 10px;
                height: 10px;
                background: ${connectionColor};
                border: 2px solid ${theme.surface};
                border-radius: 50%;
              `}
            />
          </div>
          <div
            css={`
              padding-left: ${1 * GU}px;
              padding-right: ${0.5 * GU}px;
              overflow: hidden;
              max-width: ${16 * GU}px;
              text-overflow: ellipsis;
              ${textStyle('body2')}
              white-space: nowrap;
            `}
          >
            {clientNetworkName}
          </div>
          <IconDown
            size="small"
            css={`
              color: ${theme.surfaceIcon};
            `}
          />
        </div>
      </Button>
      <Popover
        closeOnOpenerFocus
        onClose={close}
        opener={containerRef.current}
        placement="bottom-end"
        visible={opened}
        css={`
          width: 328px;
        `}
      >
        <ClientConnectionInfo
          connectionStatus={connectionStatus}
          listening={listening}
          online={online}
          syncDelay={syncDelay}
        />
      </Popover>
    </div>
  )
}

MobileConnectionDetails.propTypes = {
  connectionStatus: PropTypes.symbol,
  clientNetworkName: PropTypes.string,
  close: PropTypes.func,
  listening: PropTypes.bool,
  online: PropTypes.bool,
  opened: PropTypes.bool,
  syncDelay: PropTypes.number,
  toggle: PropTypes.func,
}

export default ClientConnectionModule
