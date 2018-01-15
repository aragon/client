import React from 'react'
import createHistory from 'history/createHashHistory'
import { styled, AragonApp } from '@aragon/ui'
import AppIFrame from './components/App/AppIFrame'
import Home from './components/Home/Home'
import MenuPanel from './components/MenuPanel/MenuPanel'
import { apps, notifications, tokens, prices, homeActions } from './demo-state'

class App extends React.Component {
  state = {
    path: '',
    sidePanelOpened: false,
    notifications,
  }
  constructor() {
    super()
    this.history = createHistory()
    this.state.path = this.history.location.pathname
    this.history.listen(this.handleNavigation)
  }
  appInstance() {
    const matches = this.state.path.match(/^\/?(\w+)\/?(\w+)?/)
    if (!matches) {
      return { appId: 'home', instanceId: '' }
    }
    return {
      appId: matches[1],
      instanceId: matches[2],
    }
  }
  changePath = path => {
    if (path !== this.state.path) {
      this.history.push(path)
    }
  }
  getAppSrc(appId) {
    const app = apps.find(app => app.id === appId)
    return (app && app.src) || ''
  }
  handleNavigation = location => {
    this.setState({ path: location.pathname })
  }
  handleOpenApp = (appId, instanceId) => {
    if (appId === 'home') {
      this.changePath('/')
      return
    }

    if (appId === 'settings') {
      this.changePath('/settings')
      return
    }

    // Get the first instance found if instanceId is not passed
    const app = apps.find(app => app.id === appId)

    const instances = (app && app.instances) || []
    const instance = instanceId
      ? instances.find(({ id }) => id === instanceId)
      : instances[0]

    this.changePath(`/${appId}${instance ? `/${instance.id}` : ''}`)
  }
  openSidePanel = () => {
    this.setState({ sidePanelOpened: true })
  }
  closeSidePanel = () => {
    this.setState({ sidePanelOpened: false })
  }
  render() {
    const { notifications } = this.state
    const { appId, instanceId } = this.appInstance()
    return (
      <AragonApp publicUrl="/aragon-ui/">
        <Main>
          <MenuPanel
            apps={apps}
            activeAppId={appId}
            activeInstanceId={instanceId}
            notifications={notifications}
            onOpenApp={this.handleOpenApp}
          />
          <AppScreen>
            {appId === 'home' && (
              <Home
                tokens={tokens}
                prices={prices}
                actions={homeActions}
                onOpenApp={this.handleOpenApp}
              />
            )}
            <AppIFrame src={this.getAppSrc(appId)} />
          </AppScreen>
        </Main>
      </AragonApp>
    )
  }
}

const Main = styled.div`
  display: flex;
  align-items: stretch;
  height: 100vh;
`

const AppScreen = styled.div`
  flex-grow: 1;
  width: 100%;
  height: 100%;
  overflow: auto;
`

export default App
