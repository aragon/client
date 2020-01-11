import React, { useState, useEffect, useRef } from 'react'
import {
  Popover,
  GU,
  IconDown,
  textStyle,
  useTheme,
  unselectable,
  ButtonBase,
} from '@aragon/ui'
import ClientConnectionInfo from './ClientConnectionInfo'
import {
  getSyncInfo,
  getLatestBlockTimestamp,
  useNetworkConnectionData,
} from './utils'
import { pollEvery } from '../../utils'

const BLOCK_TIMESTAMP_BLOCK_DELAY = 60000

function ClientConnectionModule() {
  const theme = useTheme()
  const [opened, setOpened] = useState(false)
  const [latestBlockTimestamp, setLatestBlockTimestamp] = useState(null)
  const close = () => setOpened(false)
  const toggle = () => setOpened(opened => !opened)

  const containerRef = useRef()
  const { clientNetworkName } = useNetworkConnectionData()
  const { connectionType } = getSyncInfo()

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

export default ClientConnectionModule
