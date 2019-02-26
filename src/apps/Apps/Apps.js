import React from 'react'
import PropTypes from 'prop-types'
import { NavigationBar, AppBar, AppView, TabBar, Viewport } from '@aragon/ui'
import { getKnownApp } from '../../known-apps'
import MenuButton from '../../components/MenuPanel/MenuButton'
import InstalledApps from './InstalledApps/InstalledApps'
import DiscoverApps from './DiscoverApps/DiscoverApps'

const TABS = [
  { id: 'installed', label: 'Installed apps' },
  { id: 'discover', label: 'Discover apps' },
]

const APPS_BASE = [
  {
    appName: 'voting.aragonpm.eth',
    canUpgrade: true,
  },
  { appName: 'token-manager.aragonpm.eth', canUpgrade: false },
  { appName: 'finance.aragonpm.eth', canUpgrade: true },
  { appName: 'survey.aragonpm.eth', canUpgrade: false },
]

const DEMO_APPS = Array(5)
  .fill(APPS_BASE)
  .reduce((apps, group) => apps.concat(group), [])
  .map((app, i) => {
    const knownApp = getKnownApp(app.appName)
    return {
      ...(knownApp ? { ...app, ...knownApp } : app),
      appName: app.appName.replace(
        /\./,
        `-${Math.floor(i / APPS_BASE.length) + 1}.`
      ),
      version: '0.61',
      versions: [
        { name: '0.62', date: new Date('2018-10-23') },
        { name: '0.61', date: new Date('2018-9-10') },
        { name: '0.60', date: new Date('2018-9-5') },
      ],
    }
  })

class Apps extends React.Component {
  static propTypes = {
    params: PropTypes.string.isRequired,
    onParamsRequest: PropTypes.func.isRequired,
  }
  state = {
    apps: DEMO_APPS,
  }
  handleMenuPanelOpen = () => {
    this.props.onMessage({
      data: { from: 'app', name: 'menuPanel', value: true },
    })
  }
  getLocation() {
    const { apps } = this.state
    const { params } = this.props

    if (!params) {
      return { activeTab: 0, openedAppName: null }
    }

    const parts = params.split('_')

    const activeTab = TABS.findIndex(({ id }) => id === parts[0])
    const openedApp = apps.find(({ appName }) => appName === parts[1])

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
    const { apps } = this.state
    const { activeTab, openedAppName } = this.getLocation()
    return (
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
              items={['Apps', ...(openedAppName ? ['Voting'] : [])]}
              onBack={this.closeApp}
            />
          </AppBar>
        }
      >
        {activeTab === 0 && (
          <InstalledApps
            apps={apps}
            openedAppName={openedAppName}
            onOpenApp={this.openApp}
          />
        )}
        {activeTab === 1 && <DiscoverApps />}
      </AppView>
    )
  }
}

export default Apps
