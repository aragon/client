import React from 'react'
import styled from 'styled-components'
import { theme, Text, IconCheck, IconCross } from '@aragon/ui'
import { lerp } from '../math-utils'

class Sign extends React.Component {
  static defaultProps = {
    tokenStatus: 'pending',
    daoStatus: 'pending',
  }
  render() {
    const { hideProgress } = this.props
    return (
      <Main>
        <Content
          style={{
            transform: `translateX(${lerp(hideProgress, 0, 50)}%)`,
            opacity: 1 - Math.abs(hideProgress),
          }}
        >
          <SignContent />
        </Content>
      </Main>
    )
  }
}

class SignContent extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Title>
          <Text size="great" weight="bold" color={theme.textDimmed}>
            Sign transactions
          </Text>
        </Title>

        <p>
          <Text size="large" color={theme.textSecondary}>
            Your wallet should open and you need to sign these two transactions
            after another.
          </Text>
        </p>

        <Transactions>
          <Transaction>
            <h2>
              <Text weight="bold" color={theme.textSecondary} smallcaps>
                Organisation creation
              </Text>
            </h2>
            <TxFailure />
          </Transaction>
          <Transaction>
            <h2>
              <Text weight="bold" color={theme.textSecondary} smallcaps>
                Token creation
              </Text>
            </h2>
            <TxSuccess />
          </Transaction>
        </Transactions>
      </React.Fragment>
    )
  }
}

const TxSuccess = () => (
  <StyledTx>
    <IconCheck style={{ width: '100%', height: '40px' }} />
    <p>
      <Text size="xsmall">Transaction signed!</Text>
    </p>
  </StyledTx>
)

const TxFailure = () => (
  <StyledTx>
    <IconCross style={{ width: '100%', height: '40px' }} />
    <p>
      <Text color={theme.negative} size="xsmall">
        Error signing the transaction
      </Text>
    </p>
  </StyledTx>
)

const StyledTx = styled.div`
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

export default Sign
