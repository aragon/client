import React, { useEffect, useRef, useState } from 'react'
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
  springs,
} from '@aragon/ui'
import { Spring, animated } from 'react-spring'
import { shortenAddress } from '../../web3-utils'
import { useLocalIdentity } from '../../hooks'
import { useWallet } from '../../wallet'
import NotConnected from './NotConnected'
import ConnectionInfo from './ConnectionInfo'
import { useNetworkConnectionData } from './utils'

// Metamask seems to take about ~200ms to send the connected accounts.
// This is to avoid a flash with the connection button.
const ACCOUNT_MODULE_DISPLAY_DELAY = 500

const AnimatedDiv = animated.div

function AccountModule({ compact }) {
  const { isConnected } = useWallet()
  const [display, setDisplay] = useState(false)

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
          {isConnected ? <ConnectedMode /> : <NotConnected compact={compact} />}
        </AnimatedDiv>
      )}
    </Spring>
  )
}

AccountModule.propTypes = {
  compact: PropTypes.bool,
}

function ConnectedMode() {
  const theme = useTheme()
  const [opened, setOpened] = useState(false)
  const wallet = useWallet()
  const { name: label } = useLocalIdentity(wallet.account)

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
            <EthIdenticon address={wallet.account} radius={RADIUS} />
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
                <div>{shortenAddress(wallet.account)}</div>
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
        <ConnectionInfo address={wallet.account} />
      </Popover>
    </div>
  )
}

export default AccountModule
