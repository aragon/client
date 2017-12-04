import React from 'react'
import { AragonApp } from '@aragon/ui'
import MenuPanel from './components/MenuPanel/MenuPanel'
import { apps, notifications } from './demo-state'

class App extends React.Component {
  state = {
    sidePanelOpened: false,
    notifications,
  }
  openSidePanel = () => {
    this.setState({ sidePanelOpened: true })
  }
  closeSidePanel = () => {
    this.setState({ sidePanelOpened: false })
  }
  render() {
    const { notifications } = this.state
    return (
      <AragonApp publicUrl="/aragon-ui/">
        <MenuPanel apps={apps} notifications={notifications} />
      </AragonApp>
    )
  }
}

export default App
