import React from 'react'
import styled from 'styled-components'
import { Info, theme } from '@aragon/ui'
import SignerButton from './SignerButton'

import { STATUS_SIGNING, STATUS_SIGNED, STATUS_ERROR } from './signer-statuses'

import imgPending from '../../assets/transaction-pending.svg'
import imgSuccess from '../../assets/transaction-success.svg'
import imgError from '../../assets/transaction-error.svg'

// Temporarily clean the error messages coming from Aragon.js and Metamask
const cleanErrorMessage = msg =>
  msg.replace(/^Returned error: /, '').replace(/^Error: /, '')

class SigningStatus extends React.Component {
  getSrc() {
    const { status } = this.props
    if (status === STATUS_SIGNING) return imgPending
    if (status === STATUS_SIGNED) return imgSuccess
    if (status === STATUS_ERROR) return imgError
  }
  getLabel() {
    const { status } = this.props
    if (status === STATUS_SIGNING) return 'Waiting for signature…'
    if (status === STATUS_SIGNED) return 'Transaction signed!'
    if (status === STATUS_ERROR) return 'Error signing the transaction'
  }
  getInfo() {
    const { status, signError } = this.props
    if (status === STATUS_SIGNING) {
      return (
        <React.Fragment>
          <p>
            Open your Ethereum provider (Metamask or similar) to sign your
            transaction.
          </p>
          <p>Nothing happening? Try again</p>
        </React.Fragment>
      )
    }
    if (status === STATUS_SIGNED) {
      return (
        <p>
          Success! Your transaction has been sent to the network for processing.
        </p>
      )
    }
    if (status === STATUS_ERROR) {
      return (
        <React.Fragment>
          <p>
            Woops, something went wrong. The transaction hasn’t been signed, no
            tokens have been sent.
          </p>
          {signError && <p>Error: “{cleanErrorMessage(signError.message)}”</p>}
        </React.Fragment>
      )
    }
  }
  getCloseButton() {
    const { status, onClose } = this.props
    if (status === STATUS_ERROR || status === STATUS_SIGNED) {
      return <SignerButton onClick={onClose}>Close</SignerButton>
    }
    return null
  }
  render() {
    return (
      <React.Fragment>
        <Status>
          <img src={this.getSrc()} alt="" />
          <p>{this.getLabel()}</p>
        </Status>
        <AdditionalInfo>{this.getInfo()}</AdditionalInfo>
        {this.getCloseButton()}
      </React.Fragment>
    )
  }
}

const Status = styled.div`
  margin-top: 80px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${theme.textSecondary};
  img {
    margin-bottom: 20px;
  }
`

const AdditionalInfo = styled(Info)`
  p + p {
    margin-top: 10px;
  }
`

export default SigningStatus
