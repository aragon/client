import React, { useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  EthIdenticon,
  Popover,
  GU,
  IconDown,
  RADIUS,
  textStyle,
  useTheme,
  unselectable,
  ButtonBase,
} from '@aragon/ui'
import { shortenAddress } from '../../web3-utils'
import { useAccount } from '../../account'
import NotConnected from './NotConnected'
import ConnectionInfo from './ConnectionInfo'
import { useNetworkConnectionData } from './utils'

function AccountModule({ compact }) {
  const { connected } = useAccount()
  return connected ? <ConnectedMode /> : <NotConnected compact={compact} />
}

AccountModule.propTypes = {
  compact: PropTypes.bool,
}

function ConnectedMode() {
  const { address, label } = useAccount()
  const theme = useTheme()
  const [opened, setOpened] = useState(false)

  const close = () => setOpened(false)
  const toggle = () => setOpened(opened => !opened)

  const containerRef = useRef()

  const { walletNetworkName, hasNetworkMismatch } = useNetworkConnectionData()

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
            <EthIdenticon address={address} radius={RADIUS} />
            <div
              css={`
                position: absolute;
                bottom: -3px;
                right: -3px;
                width: 10px;
                height: 10px;
                background: ${hasNetworkMismatch
                  ? theme.negative
                  : theme.positive};
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
              {label ? (
                <div
                  css={`
                    overflow: hidden;
                    max-width: ${16 * GU}px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  `}
                >
                  {label}
                </div>
              ) : (
                <div>{shortenAddress(address)}</div>
              )}
            </div>
            <div
              css={`
                font-size: 11px; /* doesn’t exist in aragonUI */
                color: ${hasNetworkMismatch ? theme.negative : theme.positive};
              `}
            >
              {hasNetworkMismatch
                ? 'Wrong network'
                : `Connected ${
                    walletNetworkName ? `to ${walletNetworkName}` : ''
                  }`}
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
        <ConnectionInfo address={address} />
      </Popover>
    </div>
  )
}

export default AccountModule
