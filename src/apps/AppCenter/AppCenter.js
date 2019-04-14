import React from 'react'
import PropTypes from 'prop-types'
import { AppBar, AppView, NavigationBar, TabBar, Viewport } from '@aragon/ui'
import MenuButton from '../../components/MenuPanel/MenuButton'
import InstalledApps from './InstalledApps/InstalledApps'
import DiscoverApps from './DiscoverApps/DiscoverApps'
import UpgradeAppPanel from './UpgradeAppPanel'
import EmptyBlock from './EmptyBlock'
import { AppInstanceGroupType, RepoType } from '../../prop-types'

const SCREENS = [
  { id: 'installed', label: 'Installed apps' },
  { id: 'discover', label: 'Discover apps' },
]

class AppCenter extends React.Component {
  static propTypes = {
    appInstanceGroups: PropTypes.arrayOf(AppInstanceGroupType).isRequired,
    onMessage: PropTypes.func.isRequired,
    onParamsRequest: PropTypes.func.isRequired,
    params: PropTypes.string,
    repos: PropTypes.arrayOf(RepoType).isRequired,
    reposLoading: PropTypes.bool.isRequired,
  }
  state = {
    upgradePanelOpened: false,
  }

  handleMenuPanelOpen = () => {
    this.props.onMessage({
      data: { from: 'app-center', name: 'menuPanel', value: true },
    })
  }
  getLocation() {
    const { params } = this.props

    if (!params) {
      return { activeTab: 0, openedRepoName: null }
    }

    const [tabId, ...repoNameParts] = params.split('.')
    const repoName = repoNameParts.join('.') // repair the ENS name
    const activeTab = SCREENS.findIndex(({ id }) => id === tabId)
    const hasRepo = Boolean(this.getRepoFromName(repoName))

    return {
      activeTab: activeTab === -1 ? 0 : activeTab,
      openedRepoName: hasRepo ? repoName : null,
    }
  }
  updateLocation({ activeTab, openedRepoName }) {
    const location = this.getLocation()
    if (activeTab !== undefined) {
      location.activeTab = activeTab
    }
    if (openedRepoName !== undefined) {
      location.openedRepoName = openedRepoName
    }

    this.props.onParamsRequest(
      `${SCREENS[location.activeTab].id}${
        location.openedRepoName ? `.${location.openedRepoName}` : ''
      }`
    )
  }
  getRepos() {
    const { appInstanceGroups, repos } = this.props
    return repos.map(repo => {
      const appGroup = appInstanceGroups.find(
        appGroup => appGroup.appId === repo.appId
      )
      return {
        ...repo,
        baseUrl: appGroup.app.baseUrl,
        name: appGroup.name,
        instances: appGroup.instances,
        repoName: appGroup.repoName,
      }
    })
  }
  getRepoFromName(repoName) {
    return this.getRepos().find(repo => repo.repoName === repoName)
  }
  handleScreenChange = tabIndex => {
    this.updateLocation({ activeTab: tabIndex })
  }
  handleOpenRepo = repoName => {
    this.updateLocation({ openedRepoName: repoName })
  }
  handleCloseRepo = () => {
    this.updateLocation({ openedRepoName: null })
  }
  handleOpenUpgradePanel = () => {
    this.setState({ upgradePanelOpened: true })
  }
  handleCloseUpgradePanel = () => {
    this.setState({ upgradePanelOpened: false })
  }

  render() {
    const { reposLoading } = this.props
    const { upgradePanelOpened } = this.state
    const { activeTab, openedRepoName } = this.getLocation()

    const repos = this.getRepos()
    const currentRepo = openedRepoName && this.getRepoFromName(openedRepoName)

    return (
      <React.Fragment>
        <AppView
          appBar={
            <AppBar
              tabs={
                openedRepoName ? null : (
                  <TabBar
                    items={SCREENS.map(screen => screen.label)}
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
                items={[
                  'App Center',
                  ...(currentRepo ? [currentRepo.name] : []),
                ]}
                onBack={this.handleCloseRepo}
              />
            </AppBar>
          }
        >
          {activeTab === 0 &&
            (reposLoading ? (
              <EmptyBlock>Loading apps…</EmptyBlock>
            ) : (
              <InstalledApps
                onOpenApp={this.handleOpenRepo}
                onRequestUpgrade={this.handleOpenUpgradePanel}
                openedRepoId={currentRepo && currentRepo.appId}
                repos={repos}
              />
            ))}
          {activeTab === 1 && <DiscoverApps />}
        </AppView>

        <UpgradeAppPanel
          repo={upgradePanelOpened ? currentRepo : null}
          onClose={this.handleCloseUpgradePanel}
        />
      </React.Fragment>
    )
  }
}

export default AppCenter
