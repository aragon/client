import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { spring, Motion } from 'react-motion'
import { theme, AppBar, Text } from '@aragon/ui'
import HomeCard from './HomeCard'
import { lerp } from '../../math-utils'

import logo from './assets/logo-background.svg'

import imgAssignTokens from './assets/assign-tokens.svg'
import imgFinance from './assets/finance.svg'
import imgPayment from './assets/payment.svg'
import imgVote from './assets/vote.svg'

const CARD_WIDTH = 220
const CARD_HEIGHT = 200
const CARD_MARGIN = 30

const SPRING = { stiffness: 120, damping: 17, precision: 0.005 }

const actions = [
  {
    id: 'assign-tokens',
    label: 'Assign Tokens',
    appName: 'Token Manager',
    img: imgAssignTokens,
  },
  {
    id: 'vote',
    label: 'Vote',
    appName: 'Voting',
    img: imgVote,
  },
  {
    id: 'check-finance',
    label: 'Check Finance',
    appName: 'Finance',
    img: imgFinance,
  },
  {
    id: 'new-payment',
    label: 'New Payment',
    appName: 'Finance',
    img: imgPayment,
  },
]

class Home extends React.Component {
  static propTypes = {
    apps: PropTypes.array.isRequired,
    appsLoading: PropTypes.bool.isRequired,
    connected: PropTypes.bool.isRequired,
    locator: PropTypes.object.isRequired,
    onOpenApp: PropTypes.func.isRequired,
  }

  state = {
    showApps: false,
  }
  constructor(props) {
    super(props)
    this.state.showApps = !props.appsLoading
  }
  componentWillReceiveProps({ appsLoading }) {
    if (appsLoading === this.props.appsLoading) {
      return
    }

    clearTimeout(this.showAppsTimer)
    this.showAppsTimer = setTimeout(() => {
      this.setState({ showApps: !appsLoading && this.props.apps.length > 0 })
    }, appsLoading ? 0 : 1000)
  }
  componentWillUnmount() {
    clearTimeout(this.showAppsTimer)
  }
  handleCardAction = actionId => {
    const { onOpenApp, apps } = this.props
    const action = actions.find(action => action.id === actionId)
    if (!action || !action.appName) {
      return
    }
    const app = apps.find(({ name }) => name === action.appName)
    if (app && onOpenApp) {
      onOpenApp(app.proxyAddress)
    }
  }
  render() {
    const { connected, apps, locator, appsLoading } = this.props
    const { showApps } = this.state

    const appActions = actions.filter(({ appName }) =>
      apps.find(({ name }) => name === appName)
    )
    return (
      <Main>
        <AppBarWrapper>
          <AppBar title="Home" />
        </AppBarWrapper>
        <ScrollWrapper>
          <AppWrapper>
            <Motion
              style={{ showAppsProgress: spring(Number(showApps), SPRING) }}
            >
              {({ showAppsProgress }) => (
                <Content>
                  <Title>
                    <Text
                      weight="bold"
                      style={{
                        fontSize: lerp(showAppsProgress, 37, 22) + 'px',
                      }}
                    >
                      Welcome to Aragon!
                    </Text>
                    <Text
                      style={{
                        display: 'block',
                        fontSize: lerp(showAppsProgress, 18, 14) + 'px',
                      }}
                    >
                      {locator.dao.endsWith('.eth')
                        ? `You are interacting with ${locator.dao}`
                        : 'You are using Aragon 0.6 — Alba'}
                    </Text>
                  </Title>
                  {appsLoading ||
                    (appActions.length > 0 && (
                      <p style={{ marginBottom: '20px' }}>
                        <Text color={theme.textSecondary}>
                          {showApps
                            ? 'What do you want to do?'
                            : 'Loading apps…'}
                        </Text>
                      </p>
                    ))}
                  <div
                    style={{
                      display: showApps ? 'block' : 'none',
                      opacity: showAppsProgress,
                      height:
                        lerp(
                          showAppsProgress,
                          0,
                          CARD_HEIGHT * Math.floor(appActions.length / 2) +
                            CARD_MARGIN * Math.floor(appActions.length / 2 - 1)
                        ) + 'px',
                    }}
                  >
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
                </Content>
              )}
            </Motion>
          </AppWrapper>
        </ScrollWrapper>
        <AppFooter>
          <ConnectionBullet connected={connected} />
          <Text size="xsmall">
            {connected ? 'Connected to the network' : 'Not connected'}
          </Text>
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

  background-color: ${theme.mainBackground};
  background-image: url(${logo});
  background-position: 50% 50%;
  background-repeat: no-repeat;
`

const AppBarWrapper = styled.div`
  flex-shrink: 0;
`

const ScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  overflow-y: scroll;
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
  padding-left: 30px;
  background: ${theme.contentBackground};
  border-top: 1px solid ${theme.contentBorder};
`

const ConnectionBullet = styled.span`
  width: 8px;
  height: 8px;
  margin-top: -2px;
  margin-right: 8px;
  border-radius: 50%;
  background: ${({ connected }) =>
    connected ? theme.positive : theme.negative};
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  padding: 40px;
`

const Title = styled.h1`
  margin-bottom: 30px;
`

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
  margin-bottom: ${CARD_MARGIN}px;
  margin-left: ${CARD_MARGIN}px;
`

export default Home
