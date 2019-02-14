import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import {
  theme,
  AppView,
  AppBar,
  Text,
  font,
  breakpoint,
  BreakPoint,
} from '@aragon/ui'
import HomeCard from './HomeCard'
import { lerp } from '../../math-utils'
import { AppType } from '../../prop-types'
import springs from '../../springs'
import MenuButton from '../MenuPanel/MenuButton'

import logo from './assets/logo-background.svg'

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
    apps: PropTypes.arrayOf(AppType).isRequired,
    appsLoading: PropTypes.bool.isRequired,
    locator: PropTypes.object.isRequired,
    onMessage: PropTypes.func.isRequired,
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
    this.showAppsTimer = setTimeout(
      () => {
        this.setState({ showApps: !appsLoading && this.props.apps.length > 0 })
      },
      appsLoading ? 0 : 1000
    )
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
  handleMenuPanelOpen = () => {
    this.props.onMessage({
      data: { from: 'app', name: 'menuPanel', value: true },
    })
  }
  render() {
    const { apps, locator } = this.props
    const { showApps } = this.state

    const appActions = actions.filter(({ appName }) =>
      apps.find(({ name }) => name === appName)
    )
    return (
      <Main>
        <AppContent>
          <AppView
            appBar={
              <AppBar>
                <AppBarTitle>
                  <BreakPoint to="medium">
                    <MenuButton onClick={this.handleMenuPanelOpen} />
                  </BreakPoint>
                  <AppBarLabel>Home</AppBarLabel>
                </AppBarTitle>
              </AppBar>
            }
          >
            <Spring
              config={springs.lazy}
              to={{ showAppsProgress: Number(showApps) }}
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
                  <p>
                    <Text color={theme.textSecondary}>
                      {showApps ? 'What do you want to do?' : 'Loading apps…'}
                    </Text>
                  </p>
                  <animated.div
                    style={{
                      display: showApps ? 'block' : 'none',
                      opacity: showAppsProgress,
                      height: showAppsProgress * 100 + '%',
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
                  </animated.div>
                </Content>
              )}
            </Spring>
          </AppView>
        </AppContent>
      </Main>
    )
  }
}

const AppBarTitle = styled.span`
  display: flex;
  align-items: center;
`

const AppBarLabel = styled.span`
  margin-left: 8px;
  ${font({ size: 'xxlarge' })};

  ${breakpoint(
    'medium',
    `
      margin-left: 24px;
    `
  )};
`

const Main = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;

  background-color: ${theme.mainBackground};
  background-image: url(${logo});
  background-position: 50% 50%;
  background-repeat: no-repeat;
`

const AppContent = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  min-height: 0;
  height: calc(100% - 54px);
`

const Content = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  text-align: center;
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
  margin-top: ${CARD_MARGIN}px;
  margin-left: ${CARD_MARGIN}px;
`

export default Home
