import React from 'react'
import styled from 'styled-components'
import { theme, Text, Button } from '@aragon/ui'
import { lerp } from '../math-utils'
import { noop } from '../utils'

import imgPending from '../assets/transaction-pending.svg'
import imgSuccess from '../assets/transaction-success.svg'
import imgError from '../assets/transaction-error.svg'
import {
  DAO_CREATION_STATUS_NONE,
  DAO_CREATION_STATUS_SUCCESS,
  DAO_CREATION_STATUS_ERROR,
} from '../symbols'

class Sign extends React.Component {
  static defaultProps = {
    positionProgress: 0,
    daoCreationStatus: DAO_CREATION_STATUS_NONE,
    onTryAgain: noop,
  }
  render() {
    const { positionProgress, daoCreationStatus, onTryAgain } = this.props
    return (
      <Main>
        <Content
          style={{
            transform: `translateX(${lerp(positionProgress, 0, 50)}%)`,
            opacity: 1 - Math.abs(positionProgress),
          }}
        >
          <SignContent
            daoCreationStatus={daoCreationStatus}
            onTryAgain={onTryAgain}
          />
        </Content>
      </Main>
    )
  }
}

class SignContent extends React.PureComponent {
  render() {
    const { daoCreationStatus, onTryAgain } = this.props
    return (
      <React.Fragment>
        <Title>
          <Text size="great" weight="bold" color={theme.textDimmed}>
            Sign transactions
          </Text>
        </Title>

        <p>
          <Text size="large" color={theme.textSecondary}>
            Your wallet should open and you need to sign two transactions, one
            after another.
          </Text>
        </p>

        <Transactions>
          <Transaction>
            <TransactionTitle>
              <Text weight="bold" color={theme.textSecondary} smallcaps>
                Token creation
              </Text>
            </TransactionTitle>
            {this.renderTxStatus(daoCreationStatus)}
          </Transaction>
          <Transaction>
            <TransactionTitle>
              <Text weight="bold" color={theme.textSecondary} smallcaps>
                Organization creation
              </Text>
            </TransactionTitle>
            {this.renderTxStatus(daoCreationStatus)}
          </Transaction>
        </Transactions>

        {daoCreationStatus === DAO_CREATION_STATUS_ERROR && (
          <TryAgain>
            <Button mode="outline" compact onClick={onTryAgain}>
              Try Again
            </Button>
          </TryAgain>
        )}

        {daoCreationStatus !== DAO_CREATION_STATUS_ERROR && (
          <Note>
            <Text size="xsmall" color={theme.textSecondary}>
              It might take some time before these transactions get processed,
              depending on the status of the network. Please be patient and do
              not close this page until it finishes.
            </Text>
          </Note>
        )}
      </React.Fragment>
    )
  }
  renderTxStatus(daoCreationStatus) {
    if (daoCreationStatus === DAO_CREATION_STATUS_ERROR) return <TxFailure />
    if (daoCreationStatus === DAO_CREATION_STATUS_SUCCESS) return <TxSuccess />
    return <TxPending />
  }
}

const TxSuccess = () => (
  <StyledTx>
    <TxIconWrapper>
      <img src={imgSuccess} alt="" />
    </TxIconWrapper>
    <p>
      <Text size="xsmall">Successful transaction.</Text>
    </p>
  </StyledTx>
)

const TxFailure = () => (
  <StyledTx>
    <TxIconWrapper>
      <img src={imgError} alt="" />
    </TxIconWrapper>
    <p>
      <Text color={theme.negative} size="xsmall">
        Error with the transaction.
      </Text>
    </p>
  </StyledTx>
)

const TxPending = () => (
  <StyledTx>
    <TxIconWrapper>
      <img src={imgPending} alt="" />
    </TxIconWrapper>
    <p>
      <Text size="xsmall">Waiting…</Text>
    </p>
  </StyledTx>
)

const TxIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
`

const StyledTx = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  p {
    margin-top: 30px;
    white-space: nowrap;
  }
`

const Main = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 100px;
  padding-top: 140px;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  font-size: 37px;
  margin-bottom: 60px;
`

const Transactions = styled.div`
  display: flex;
  margin-top: 60px;
  text-align: center;
`

const Transaction = styled.div`
  width: 145px;
  &:first-child {
    margin-right: 145px;
  }
`

const TransactionTitle = styled.h2`
  white-space: nowrap;
`

const Note = styled.p`
  max-width: 55%;
  min-width: 325px;
  margin-top: 40px;
  text-align: center;
`

const TryAgain = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`

export default Sign
