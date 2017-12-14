import React from 'react'
import createHistory from 'history/createHashHistory'
import { styled, AragonApp } from '@aragon/ui'
import Home from './components/Home/Home'
import MenuPanel from './components/MenuPanel/MenuPanel'
import { apps, notifications } from './demo-state'

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
    const matches = this.state.path.match(/^\/?([a-z]+)\/?([a-zA-Z0-9]+)?/)
    if (!matches) {
      return { app: 'home', instance: '' }
    }
    return {
      app: matches[1],
      instance: matches[2],
    }
  }
  handleNavigation = location => {
    this.setState({ path: location.pathname })
  }
  handlePathChange = path => {
    if (path !== this.state.path) {
      this.history.push(path)
    }
  }
  openSidePanel = () => {
    this.setState({ sidePanelOpened: true })
  }
  closeSidePanel = () => {
    this.setState({ sidePanelOpened: false })
  }
  render() {
    const { notifications } = this.state
    const { app, instance } = this.appInstance()
    return (
      <AragonApp publicUrl="/aragon-ui/">
        <Main>
          <MenuPanel
            apps={apps}
            activeApp={app}
            activeInstance={instance}
            notifications={notifications}
            onPathChange={this.handlePathChange}
          />
          <AppScreen>
            {app === 'home' && <Home />}
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
