import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  ButtonText,
  IconCoin,
  Info,
  GU,
  textStyle,
} from '@aragon/ui'
import { network } from '../../environment'
import { sanitizeNetworkType } from '../../network-config'
import providerString from '../../provider-strings'

const OpenAppButton = props => (
  <ButtonText
    css={`
      padding: 0;
      font-weight: 600;
    `}
    {...props}
  />
)

const RequestTokens = ({
  handleDepositTestTokens,
  handleOpenFinanceApp,
  enableTransactions,
  walletNetwork,
  walletProviderId,
}) => (
  <Box padding={3 * GU} heading="Request test tokens">
    <p
      css={`
        margin-bottom: ${2 * GU}px;
        ${textStyle('body2')}
      `}
    >
      Deposit some tokens into your organization for testing purposes.
    </p>
    <Button
      label="Request test tokens"
      icon={<IconCoin />}
      display="all"
      onClick={handleDepositTestTokens}
      disabled={!enableTransactions}
      css={`
        margin-bottom: ${2 * GU}px;
      `}
    />
    {enableTransactions ? (
      <Info>
        <p>
          Requesting tokens will assign random{' '}
          <strong css="font-weight: 800">test tokens</strong> to your
          organization. These tokens are named after existing projects, but keep
          in mind{' '}
          <strong css="font-weight: 800">they are not real tokens</strong>.
        </p>
        <p
          css={`
            margin-top: ${1 * GU}px;
          `}
        >
          You can view the received tokens in{' '}
          <OpenAppButton onClick={handleOpenFinanceApp}>Finance</OpenAppButton>.
        </p>
      </Info>
    ) : (
      <Info mode="warning">
        {`Please ${
          walletNetwork !== network.type
            ? `select the ${sanitizeNetworkType(network.type)} network`
            : 'unlock your account'
        } in ${providerString('your Ethereum provider', walletProviderId)}.`}
      </Info>
    )}
  </Box>
)

RequestTokens.propTypes = {
  handleDepositTestTokens: PropTypes.func.isRequired,
  handleOpenFinanceApp: PropTypes.func.isRequired,
  enableTransactions: PropTypes.bool.isRequired,
  walletNetwork: PropTypes.string.isRequired,
  walletProviderId: PropTypes.string.isRequired,
}

export default RequestTokens
