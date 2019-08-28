import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text, useTheme } from '@aragon/ui'
import HomeCard from './HomeCard'
import { AppType } from '../../prop-types'
import { appIds } from '../../environment'

import imgAssignTokens from './assets/assign-tokens.svg'
import imgFinance from './assets/finance.svg'
import imgPayment from './assets/payment.svg'
import imgVote from './assets/vote.svg'

const CARD_WIDTH = 200
const CARD_HEIGHT = 180
const CARD_MARGIN = 30

const actions = [
  {
    id: 'assign-tokens',
    label: 'Assign Tokens',
    appName: 'Tokens',
    appId: appIds['TokenManager'],
    img: imgAssignTokens,
  },
  {
    id: 'vote',
    label: 'Vote',
    appName: 'Voting',
    appId: appIds['Voting'],
    img: imgVote,
  },
  {
    id: 'check-finance',
    label: 'Check Finance',
    appName: 'Finance',
    appId: appIds['Finance'],
    img: imgFinance,
  },
  {
    id: 'new-payment',
    label: 'New Payment',
    appName: 'Finance',
    appId: appIds['Finance'],
    img: imgPayment,
  },
]

class Home extends React.Component {
  static propTypes = {
    apps: PropTypes.arrayOf(AppType).isRequired,
    dao: PropTypes.string.isRequired,
    onOpenApp: PropTypes.func.isRequired,
  }
  handleCardAction = actionId => {
    const { onOpenApp, apps } = this.props
    const action = actions.find(action => action.id === actionId)
    if (!action || !action.appId) {
      return
    }
    const app = apps.find(({ appId }) => appId === action.appId)
    if (app && onOpenApp) {
      onOpenApp(app.proxyAddress)
    }
  }
  render() {
    const { theme, apps, dao } = this.props

    const appActions = actions.filter(({ appId }) =>
      apps.find(app => app.appId === appId)
    )

    return (
      <div
        css={`
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          width: 100%;
          height: 100%;
          padding-top: 40px;
          padding-bottom: 40px;
          background-color: ${theme.background};
        `}
      >
        <h1 css="margin-bottom: 30px">
          <Text weight="bold" size="xxlarge">
            Welcome to Aragon!
          </Text>
          <div>
            <Text size="small">
              {dao.endsWith('.eth')
                ? `You are interacting with ${dao}`
                : 'You are using Aragon 0.8 — Camino'}
            </Text>
          </div>
        </h1>
        <p>
          <Text color={theme.content}>What do you want to do?</Text>
        </p>
        <Cards>
          {appActions.map(({ id, label, img }) => (
            <CardWrap key={id}>
              <HomeCard
                id={id}
                title={label}
                icon={img}
                onActivate={this.handleCardAction}
              />
            </CardWrap>
          ))}
        </Cards>
      </div>
    )
  }
}

const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: calc(${CARD_WIDTH}px * 2 + ${CARD_MARGIN}px * 2);
  margin-left: -${CARD_MARGIN}px;
`

const CardWrap = styled.div`
  flex-shrink: 0;
  flex-grow: 0;
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
  margin-top: ${CARD_MARGIN}px;
  margin-left: ${CARD_MARGIN}px;
`

export default function(props) {
  const theme = useTheme()
  return <Home {...props} theme={theme} />
}
