import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Box, GU, Info, textStyle, useTheme } from '@aragon/ui'
import { getProviderString } from 'use-wallet'
import FeedbackIndicator from '../FeedbackIndicator/FeedbackIndicator'
import SignerButton from './SignerButton'

import {
  STATUS_TX_ERROR,
  STATUS_TX_SIGNED,
  STATUS_TX_SIGNING,
  SignerStatusType,
  STATUS_MSG_SIGNING,
  STATUS_MSG_SIGNED,
  STATUS_MSG_ERROR,
  isSignatureSuccess,
  isSignatureError,
  isSigning,
  isSignatureCompleted,
} from './signer-statuses'

// Temporarily clean the error messages coming from Aragon.js and Metamask
const cleanErrorMessage = errorMsg =>
  errorMsg
    // Only use the first line if multiple lines are available.
    // This makes sure we don't show the stack trace if it becomes part of the message.
    .split('\n')[0]
    .replace(/^Returned error: /, '')
    .replace(/^Error: /, '')

class SigningStatus extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    status: SignerStatusType.isRequired,
    signError: PropTypes.instanceOf(Error),
    walletProviderId: PropTypes.string,
    theme: PropTypes.object,
  }
  getLabel() {
    const { status } = this.props
    if (isSigning(status)) return 'Waiting for signature…'
    if (status === STATUS_TX_SIGNED) return 'Transaction signed!'
    if (status === STATUS_MSG_SIGNED) return 'Message signed!'
    if (status === STATUS_TX_ERROR) return 'Signing transaction failed!'
    if (status === STATUS_MSG_ERROR) return 'Signing message failed!'
  }
  getInfo() {
    const { status, walletProviderId } = this.props
    if (status === STATUS_TX_SIGNING) {
      return (
        <p>
          {`Open ${getProviderString(
            'your wallet',
            walletProviderId
          )} to sign your transaction.`}
        </p>
      )
    }
    if (status === STATUS_MSG_SIGNING) {
      return (
        <p>{`Open ${getProviderString(
          'your wallet',
          walletProviderId
        )} to sign your message.`}</p>
      )
    }
    if (status === STATUS_TX_SIGNED) {
      return (
        <p>
          Success! Your transaction has been sent to the network for processing.
        </p>
      )
    }
    if (status === STATUS_MSG_SIGNED) {
      return <p>Success! Your message has been signed.</p>
    }
    if (status === STATUS_TX_ERROR) {
      return this.getErrorMessage(
        "Your transaction wasn't signed and no tokens were sent."
      )
    }
    if (status === STATUS_MSG_ERROR) {
      return this.getErrorMessage("Your message wasn't signed.")
    }
  }
  getCloseButton() {
    const { status, onClose } = this.props
    if (isSignatureCompleted(status)) {
      return <SignerButton onClick={onClose}>Close</SignerButton>
    }
    return null
  }
  getErrorMessage(warning) {
    const { signError } = this.props
    const cleanedErrorMessage = cleanErrorMessage(
      (signError && signError.message) || ''
    )
    return (
      <React.Fragment>
        <p>{warning}</p>
        {cleanedErrorMessage ? (
          <p>Error: “{cleanedErrorMessage}”</p>
        ) : (
          <p>There may have been a problem with your wallet.</p>
        )}
      </React.Fragment>
    )
  }
  render() {
    const { theme, status } = this.props
    return (
      <div>
        <Box
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          <Status color={theme.surfaceContent}>
            <FeedbackIndicator
              status={
                isSignatureSuccess(status)
                  ? 'success'
                  : isSignatureError(status)
                  ? 'error'
                  : 'pending'
              }
            />
            <p
              css={`
                margin-top: ${2 * GU}px;
                ${textStyle('body2')};
              `}
            >
              {this.getLabel()}
            </p>
          </Status>
        </Box>
        <Info>{this.getInfo()}</Info>
        {this.getCloseButton()}
      </div>
    )
  }
}

const Status = styled.div`
  height: ${38 * GU}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${({ color }) => color};
`

export default props => {
  const theme = useTheme()
  return <SigningStatus {...props} theme={theme} />
}
