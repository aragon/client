import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Popover,
  GU,
  IconDown,
  textStyle,
  useTheme,
  unselectable,
  ButtonBase,
  Button,
  useViewport,
  springs,
} from '@aragon/ui'
import { Spring, animated } from 'react-spring'
import ClientConnectionInfo from './ClientConnectionInfo'
import {
  getSyncInfo,
  getLatestBlockTimestamp,
  useNetworkConnectionData,
} from './utils'
import { pollEvery } from '../../utils'

// This is to avoid unnecesarily displaying the Client Connection Module
// if the user has a wallet connected.
const ACCOUNT_MODULE_DISPLAY_DELAY = 500
const BLOCK_TIMESTAMP_BLOCK_DELAY = 60000

const AnimatedDiv = animated.div

function ClientConnectionModule() {
  const [opened, setOpened] = useState(false)
  const [display, setDisplay] = useState(false)
  const [latestBlockTimestamp, setLatestBlockTimestamp] = useState(null)
  const { clientNetworkName } = useNetworkConnectionData()
  const { below } = useViewport()

  const toggle = () => setOpened(opened => !opened)

  const { connectionType } = getSyncInfo(latestBlockTimestamp)

  useEffect(() => {
    const pollBlockTimestamp = pollEvery(
      () => ({
        request: () => getLatestBlockTimestamp(),
        onResult: timestamp => setLatestBlockTimestamp(timestamp),
      }),
      BLOCK_TIMESTAMP_BLOCK_DELAY
    )
    const cleanUpTimestampPoll = pollBlockTimestamp()

    return () => cleanUpTimestampPoll()
  }, [])

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
              connectionType={connectionType}
              latestBlockTimestamp={latestBlockTimestamp}
              toggle={toggle}
              opened={opened}
            />
          ) : (
            <ConnectionDetails
              clientNetworkName={clientNetworkName}
              connectionType={connectionType}
              latestBlockTimestamp={latestBlockTimestamp}
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
  connectionType,
  latestBlockTimestamp,
  opened,
  toggle,
}) {
  const containerRef = useRef()
  const theme = useTheme()
  if (!latestBlockTimestamp) {
    return null
  }
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
                background: ${theme.positive};
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
                color: ${theme.positive};
              `}
            >
              Connected to {clientNetworkName}
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
      >
        <ClientConnectionInfo
          connectionType={connectionType}
          latestBlockTimestamp={latestBlockTimestamp}
        />
      </Popover>
    </div>
  )
}

ConnectionDetails.propTypes = {
  clientNetworkName: PropTypes.string,
  connectionType: PropTypes.string,
  latestBlockTimestamp: PropTypes.number,
  opened: PropTypes.bool,
  toggle: PropTypes.func,
}

function MobileConnectionDetails({
  clientNetworkName,
  connectionType,
  latestBlockTimestamp,
  opened,
  toggle,
}) {
  const containerRef = useRef()
  const theme = useTheme()
  if (!latestBlockTimestamp) {
    return null
  }

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
                background: ${theme.positive};
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
      >
        <ClientConnectionInfo
          connectionType={connectionType}
          latestBlockTimestamp={latestBlockTimestamp}
        />
      </Popover>
    </div>
  )
}

MobileConnectionDetails.propTypes = {
  clientNetworkName: PropTypes.string,
  connectionType: PropTypes.string,
  latestBlockTimestamp: PropTypes.number,
  opened: PropTypes.bool,
  toggle: PropTypes.func,
}

export default ClientConnectionModule
