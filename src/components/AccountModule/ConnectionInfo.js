import React from 'react'
import styled from 'styled-components'
import {
  ButtonBase,
  GU,
  IconCheck,
  IconCopy,
  IconCross,
  IdentityBadge,
  RADIUS,
  textStyle,
  useTheme,
} from '@aragon/ui'

import { useCopyToClipboard } from '../../copy-to-clipboard'
import { useWallet } from '../../wallet'
import { useNetworkConnectionData } from './utils'
import SyncedInfo from './SyncedInfo'

const FlexWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`

function ConnectionInfo() {
  const { account, providerInfo } = useWallet()
  const theme = useTheme()

  const {
    walletNetworkName,
    clientNetworkName,
    hasNetworkMismatch,
  } = useNetworkConnectionData()

  const copyAddress = useCopyToClipboard(account, 'Address copied')

  const Icon = hasNetworkMismatch ? IconCross : IconCheck

  return (
    <section
      css={`
        max-width: ${51 * GU}px;
      `}
    >
      <h1
        css={`
          display: flex;
          align-items: center;
          height: ${4 * GU}px;
          padding: 0 ${2 * GU}px;
          ${textStyle('label2')};
          color: ${theme.surfaceContentSecondary};
          border-bottom: 1px solid ${theme.border};
        `}
      >
        Ethereum connection
      </h1>

      <div
        css={`
          padding: ${2 * GU}px;
        `}
      >
        <FlexWrapper>
          <FlexWrapper
            css={`
              margin-right: ${3 * GU}px;
            `}
          >
            <img
              src={providerInfo.image}
              alt=""
              css={`
                width: ${2.5 * GU}px;
                height: ${2.5 * GU}px;
                margin-right: ${0.5 * GU}px;
                transform: translateY(-2px);
              `}
            />
            <span>Wallet Connected</span>
          </FlexWrapper>
          <FlexWrapper>
            <ButtonBase
              onClick={copyAddress}
              focusRingRadius={RADIUS}
              css={`
                display: flex;
                align-items: center;
                padding: ${0.5 * GU}px;
                &:active {
                  background: ${theme.surfacePressed};
                }
              `}
            >
              <IdentityBadge
                entity={account}
                compact
                badgeOnly
                css="cursor: pointer"
              />
              <IconCopy
                css={`
                  color: ${theme.hint};
                `}
              />
            </ButtonBase>
          </FlexWrapper>
        </FlexWrapper>
        <FlexWrapper
          css={`
            display: flex;
            margin-top: ${1 * GU}px;
            color: ${hasNetworkMismatch ? theme.negative : theme.positive};
            ${textStyle('label2')};
          `}
        >
          <Icon size="small" />
          {walletNetworkName && (
            <span
              css={`
                margin-left: ${0.5 * GU}px;
              `}
            >
              Connected to Ethereum {walletNetworkName} Network
            </span>
          )}
        </FlexWrapper>

        {hasNetworkMismatch ? (
          <div
            css={`
              margin-top: ${1 * GU}px;
            `}
          >
            Please connect to the Ethereum {clientNetworkName} Network.
          </div>
        ) : (
          <SyncedInfo />
        )}
      </div>
    </section>
  )
}

export default ConnectionInfo
