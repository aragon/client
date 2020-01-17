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
  resolveConnectionMessage,
  useNetworkConnectionData,
  useConnectionStatusColor,
} from './utils'
import { useSyncInfo, CONNECTION_STATUS_ERROR } from './useSyncInfo'

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
              clientNetworkName={clientNetworkName}
              close={close}
              connectionStatus={connectionStatus}
              listening={listening}
              online={online}
              syncDelay={syncDelay}
              toggle={toggle}
              opened={opened}
            />
          ) : (
            <ConnectionDetails
              clientNetworkName={clientNetworkName}
              close={close}
              connectionStatus={connectionStatus}
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
  const connectionMessage = resolveConnectionMessage(
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
        placement="bottom-end"
        onClose={close}
        visible={opened}
        opener={containerRef.current}
        css={`
          width: 410px;
        `}
      >
        <ClientConnectionInfo
          connectionStatus={connectionStatus}
          syncDelay={syncDelay}
          online={online}
          listening={listening}
        />
      </Popover>
    </div>
  )
}

ConnectionDetails.propTypes = {
  clientNetworkName: PropTypes.string,
  close: PropTypes.func,
  connectionStatus: PropTypes.string,
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
        placement="bottom-end"
        onClose={close}
        visible={opened}
        opener={containerRef.current}
        css={`
          width: 328px;
        `}
      >
        <ClientConnectionInfo
          connectionStatus={connectionStatus}
          syncDelay={syncDelay}
          online={online}
          listening={listening}
        />
      </Popover>
    </div>
  )
}

MobileConnectionDetails.propTypes = {
  clientNetworkName: PropTypes.string,
  close: PropTypes.func,
  connectionStatus: PropTypes.string,
  listening: PropTypes.bool,
  online: PropTypes.bool,
  opened: PropTypes.bool,
  syncDelay: PropTypes.number,
  toggle: PropTypes.func,
}

export default ClientConnectionModule
