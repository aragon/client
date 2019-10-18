import React from 'react'
import styled from 'styled-components'
import {
  GU,
  textStyle,
  IdentityBadge,
  useTheme,
  IconCopy,
  IconCheck,
  IconCross,
  ButtonBase,
} from '@aragon/ui'

import {
  useConnectionColor,
  useNetworkConnectionData,
  useCopyToClipboard,
} from './utils'
import { useAccount } from '../../account'
import SyncedInfo from './SyncedInfo'

const FlexWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`

const ConnectionInfo = () => {
  const { address, providerInfo } = useAccount()
  const theme = useTheme()
  const connectionColor = useConnectionColor()

  const {
    walletNetworkName,
    clientNetworkName,
    hasNetworkMismatch,
  } = useNetworkConnectionData()

  const copyAddress = useCopyToClipboard(address, 'Address copied')

  const Icon = hasNetworkMismatch ? IconCross : IconCheck

  return (
    <section
      css={`
        max-width: ${42 * GU}px;
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
              margin-right: 25px;
            `}
          >
            <img
              src={providerInfo.image}
              alt=""
              css={`
                width: 20px;
                height: 20px;
                margin-right: 5px;
                transform: translateY(-2px);
              `}
            />
            <span>{providerInfo.name}</span>
          </FlexWrapper>
          <FlexWrapper>
            <IdentityBadge
              entity={address}
              compact
              onClick={copyAddress}
              css={`
                &:active {
                  background: none;
                }
              `}
            />
            <ButtonBase onClick={copyAddress}>
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
            margin-top: 10px;
            margin-left: -5px;
            color: ${connectionColor};
            text-transform: uppercase;
            font-size: 12px;
          `}
        >
          <Icon size="small" />
          {walletNetworkName && (
            <span>Connected to Ethereum {walletNetworkName} Network</span>
          )}
        </FlexWrapper>

        {hasNetworkMismatch ? (
          <div
            css={`
              margin-top: 10px;
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
