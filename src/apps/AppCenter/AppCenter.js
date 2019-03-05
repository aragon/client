import React from 'react'
import PropTypes from 'prop-types'
import { AppBar, AppView, NavigationBar, TabBar, Viewport } from '@aragon/ui'
import MenuButton from '../../components/MenuPanel/MenuButton'
import InstalledApps from './InstalledApps/InstalledApps'
import DiscoverApps from './DiscoverApps/DiscoverApps'
import UpgradeAppPanel from './UpgradeAppPanel'
import EmptyBlock from './EmptyBlock'
import { getAppsFromInstances } from '../../apps-utils'

const TABS = [
  { id: 'installed', label: 'Installed apps' },
  { id: 'discover', label: 'Discover apps' },
]

class AppCenter extends React.Component {
  static propTypes = {
    apps: PropTypes.array,
    appsLoading: PropTypes.bool,
    params: PropTypes.string,
    onParamsRequest: PropTypes.func.isRequired,
    onMessage: PropTypes.func.isRequired,
  }
  static defaultProps = {
    apps: [],
  }
  state = {
    upgradePanelOpened: false,
  }

  handleMenuPanelOpen = () => {
    this.props.onMessage({
      data: { from: 'app', name: 'menuPanel', value: true },
    })
  }
  getLocation() {
    const { params } = this.props

    if (!params) {
      return { activeTab: 0, openedAppName: null }
    }

    const parts = params.split('_')
    const activeTab = TABS.findIndex(({ id }) => id === parts[0])
    const openedApp = this.getAppFromAppName(parts[1])

    return {
      activeTab: activeTab === -1 ? 0 : activeTab,
      openedAppName: openedApp ? openedApp.appName : null,
    }
  }
  updateLocation({ activeTab, openedAppName }) {
    const location = this.getLocation()
    if (activeTab !== undefined) {
      location.activeTab = activeTab
    }
    if (openedAppName !== undefined) {
      location.openedAppName = openedAppName
    }

    this.props.onParamsRequest(
      `${TABS[location.activeTab].id}${
        location.openedAppName ? `_${location.openedAppName}` : ''
      }`
    )
  }
  getApps() {
    return getAppsFromInstances(this.props.apps)
  }
  getAppFromAppName(appName) {
    return this.getApps().find(app => app.appName === appName)
  }
  openUpgradePanel = () => {
    this.setState({ upgradePanelOpened: true })
  }
  closeUpgradePanel = () => {
    this.setState({ upgradePanelOpened: false })
  }
  handleScreenChange = tabIndex => {
    this.updateLocation({ activeTab: tabIndex })
  }
  openApp = appName => {
    this.updateLocation({ openedAppName: appName })
  }
  closeApp = () => {
    this.updateLocation({ openedAppName: null })
  }

  render() {
    const { appsLoading } = this.props
    const { upgradePanelOpened } = this.state
    const { activeTab, openedAppName } = this.getLocation()

    const apps = this.getApps()
    const currentApp = openedAppName && this.getAppFromAppName(openedAppName)

    return (
      <React.Fragment>
        <AppView
          appBar={
            <AppBar
              tabs={
                openedAppName ? null : (
                  <TabBar
                    items={TABS.map(screen => screen.label)}
                    selected={activeTab}
                    onChange={this.handleScreenChange}
                  />
                )
              }
            >
              <Viewport>
                {({ below }) =>
                  below('medium') && (
                    <MenuButton onClick={this.handleMenuPanelOpen} />
                  )
                }
              </Viewport>
              <NavigationBar
                items={['App Center', ...(currentApp ? [currentApp.name] : [])]}
                onBack={this.closeApp}
              />
            </AppBar>
          }
        >
          {activeTab === 0 &&
            (appsLoading ? (
              <EmptyBlock>Loading apps…</EmptyBlock>
            ) : (
              <InstalledApps
                apps={apps}
                openedAppName={openedAppName}
                onOpenApp={this.openApp}
                onRequestUpgrade={this.openUpgradePanel}
              />
            ))}
          {activeTab === 1 && <DiscoverApps />}
        </AppView>

        <UpgradeAppPanel
          app={upgradePanelOpened && this.getAppFromAppName(openedAppName)}
          onClose={this.closeUpgradePanel}
        />
      </React.Fragment>
    )
  }
}

export default AppCenter
