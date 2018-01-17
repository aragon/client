import React from 'react'
import styled from 'styled-components'
import { theme, AppBar } from '@aragon/ui'
import HomeCard from './HomeCard'
import Token from './Token'
import PricesBar from './PricesBar'

import imgAssignTokens from './assets/assign-tokens.svg'
import imgFinance from './assets/finance.svg'
import imgGroups from './assets/groups.svg'
import imgPayment from './assets/payment.svg'
import imgTransferTokens from './assets/transfer-tokens.svg'
import imgVote from './assets/vote.svg'

const LARGE_WIDTH = 1300

const CARD_HEIGHT = 220
const CARD_WIDTH_MIN = 190
const CARD_WIDTH_MAX = 220
const CARD_MARGIN = 30

// Temporary: the action => icon mapping will be made by apps
const imgActions = new Map()
imgActions.set('transfer-tokens', imgTransferTokens)
imgActions.set('assign-tokens', imgAssignTokens)
imgActions.set('vote', imgVote)
imgActions.set('view-groups', imgGroups)
imgActions.set('check-finance', imgFinance)
imgActions.set('new-payment', imgPayment)

class Home extends React.Component {
  handleCardAction = actionId => {
    const { actions, onOpenApp } = this.props
    const action = actions.find(action => action.id === actionId)
    if (action) {
      onOpenApp(action.app)
    }
  }
  render() {
    const { tokens, prices, actions } = this.props
    return (
      <Main>
        <AppBarWrapper>
          <AppBar title="Welcome!" />
        </AppBarWrapper>
        <ScrollWrapper>
          <AppWrapper>
            <Content>
              <Title>What do you want to do?</Title>
              <Cards>
                {actions.map(({ id, label }) => (
                  <CardWrap key={id}>
                    <HomeCard
                      id={id}
                      title={label}
                      icon={imgActions.get(id)}
                      onActivate={this.handleCardAction}
                    />
                  </CardWrap>
                ))}
              </Cards>
            </Content>
            <Sidebar>
              <h1>Your tokens</h1>
              <ul>
                {tokens.map(token => (
                  <li key={token.symbol}>
                    <Token {...token} />
                  </li>
                ))}
              </ul>
            </Sidebar>
          </AppWrapper>
        </ScrollWrapper>
        <AppFooter>
          <PricesBar prices={prices} />
        </AppFooter>
      </Main>
    )
  }
}

const Main = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
`

const AppBarWrapper = styled.div`
  flex-shrink: 0;
`

const ScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  overflow: auto;
  flex-grow: 1;
`

const AppWrapper = styled.div`
  flex-grow: 1;
  min-height: min-content;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
`

const AppFooter = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 54px;
  background: ${theme.contentBackground};
  border-top: 1px solid ${theme.contentBorder};
`

const Content = styled.div`
  width: 100%;
  padding: 40px;
`

const Title = styled.h1`
  font-weight: 600;
  font-size: 16px;
`

const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-width: calc(${CARD_WIDTH_MIN}px * 2 + ${CARD_MARGIN}px * 2);
  max-width: calc(${CARD_WIDTH_MAX}px * 2 + ${CARD_MARGIN}px * 2);
  margin-left: -${CARD_MARGIN}px;

  @media (min-width: ${LARGE_WIDTH}px) {
    min-width: calc(${CARD_WIDTH_MIN}px * 3 + ${CARD_MARGIN}px * 3);
    min-width: calc(100% + ${CARD_MARGIN}px);
  }
`

const CardWrap = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  width: calc(100% / 2 - ${CARD_MARGIN}px);
  max-width: ${CARD_WIDTH_MAX}px;
  height: ${CARD_HEIGHT}px;
  margin-top: ${CARD_MARGIN}px;
  margin-left: ${CARD_MARGIN}px;

  @media (min-width: ${LARGE_WIDTH}px) {
    width: calc(100% / 3 - ${CARD_MARGIN}px);
  }
`

const Sidebar = styled.aside`
  flex-shrink: 0;
  flex-grow: 0;
  width: 360px;
  min-height: 100%;
  padding: 40px 30px;
  background: #edf3f6;

  h1 {
    padding-bottom: 5px;
    color: ${theme.textSecondary};
    text-transform: lowercase;
    font-variant: small-caps;
    font-weight: 600;
    font-size: 16px;
    border-bottom: 1px solid ${theme.contentBorder};
  }
  li {
    margin-top: 30px;
    list-style: none;
  }
`

export default Home
