import React from 'react'
import PropTypes from 'prop-types'
import {
  AppBar,
  AppView,
  NavigationBar,
  SidePanel,
  TabBar,
  Viewport,
} from '@aragon/ui'
import { getKnownApp } from '../../known-apps'
import MenuButton from '../../components/MenuPanel/MenuButton'
import InstalledApps from './InstalledApps/InstalledApps'
import DiscoverApps from './DiscoverApps/DiscoverApps'
import UpgradeAppPanel from './UpgradeAppPanel'

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
      version: '0.5.3',
      versions: [
        {
          name: '0.5.4',
          date: new Date('2018-10-18'),
          changelogUrl:
            'https://github.com/aragon/aragon-apps/releases/tag/0.5.4',
        },
        {
          name: '0.5.3',
          date: new Date('2018-7-17'),
          changelogUrl:
            'https://github.com/aragon/aragon-apps/releases/tag/0.5.3',
        },
        {
          name: '0.5.2',
          date: new Date('2018-6-19'),
          changelogUrl:
            'https://github.com/aragon/aragon-apps/releases/tag/0.5.2',
        },
        {
          name: '0.5.1',
          date: new Date('2018-5-31'),
          changelogUrl:
            'https://github.com/aragon/aragon-apps/releases/tag/0.5.1',
        },
        {
          name: '0.5.0',
          date: new Date('2018-3-29'),
          changelogUrl:
            'https://github.com/aragon/aragon-apps/releases/tag/0.5.0',
        },
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
    upgradePanelOpened: false,
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
  getAppByAppName(appName) {
    return this.state.apps.find(app => app.appName === appName)
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
    const { apps, upgradePanelOpened } = this.state
    const { activeTab, openedAppName } = this.getLocation()

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
              onRequestUpgrade={this.openUpgradePanel}
            />
          )}
          {activeTab === 1 && <DiscoverApps />}
        </AppView>

        <UpgradeAppPanel
          app={upgradePanelOpened && this.getAppByAppName(openedAppName)}
          onClose={this.closeUpgradePanel}
        />
      </React.Fragment>
    )
  }
}

export default Apps
