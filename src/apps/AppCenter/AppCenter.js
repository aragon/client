import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  AppBar,
  AppView,
  NavigationBar,
  TabBar,
  Viewport,
  Button,
} from '@aragon/ui'
import MenuButton from '../../components/MenuPanel/MenuButton'
import InstalledApps from './InstalledApps/InstalledApps'
import DiscoverApps from './DiscoverApps/DiscoverApps'
import UpgradeAppPanel from './UpgradeAppPanel'
import IconUpgrade from './IconUpgrade'
import EmptyBlock from './EmptyBlock'
import { KERNEL_APP_BASE_NAMESPACE } from '../../aragonos-utils'
import {
  AppInstanceGroupType,
  AragonType,
  DaoAddressType,
  RepoType,
} from '../../prop-types'
import { repoBaseUrl } from '../../url-utils'
import { log } from '../../utils'

const SCREENS = [
  { id: 'installed', label: 'Installed apps' },
  { id: 'discover', label: 'Discover apps' },
]

class AppCenter extends React.Component {
  static propTypes = {
    appInstanceGroups: PropTypes.arrayOf(AppInstanceGroupType).isRequired,
    daoAddress: DaoAddressType.isRequired,
    onMessage: PropTypes.func.isRequired,
    onParamsRequest: PropTypes.func.isRequired,
    params: PropTypes.string,
    repos: PropTypes.arrayOf(RepoType).isRequired,
    reposLoading: PropTypes.bool.isRequired,
    canUpgradeOrg: PropTypes.bool.isRequired,
    onUpgradeAll: PropTypes.func.isRequired,
    wrapper: AragonType,
  }
  state = {
    upgradePanelOpened: false,
  }

  handleMenuPanelOpen = () => {
    this.props.onMessage({
      data: { from: 'app-center', name: 'menuPanel', value: true },
    })
  }
  handleUpgradeApp = async (appId, appAddress) => {
    const { daoAddress, wrapper } = this.props

    log('setApp', appId, appAddress)
    // Calculate the path, if it exists
    const updatePath = await wrapper.getTransactionPath(
      daoAddress.address, // destination (Kernel)
      'setApp', // method
      [KERNEL_APP_BASE_NAMESPACE, appId, appAddress] // params
    )
    // Try to perform the path
    wrapper.performTransactionPath(updatePath)

    this.setState({ upgradePanelOpened: false })
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
        baseUrl: repoBaseUrl(repo),
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
    const { reposLoading, onUpgradeAll, canUpgradeOrg } = this.props
    const { upgradePanelOpened } = this.state
    const { activeTab, openedRepoName } = this.getLocation()
    const repos = this.getRepos()
    const currentRepo = openedRepoName && this.getRepoFromName(openedRepoName)

    const navigationItems = [
      'App Center',
      ...(currentRepo ? [currentRepo.name] : []),
    ]

    return (
      <React.Fragment>
        <AppView
          style={{ height: '100%' }}
          appBar={
            <Viewport>
              {({ below, above }) => (
                <AppBar
                  tabs={
                    openedRepoName ? null : (
                      <div
                        css={`
                          margin-left: ${below('medium') ? '-14px' : '0'};
                        `}
                      >
                        <TabBar
                          items={SCREENS.map(screen => screen.label)}
                          selected={activeTab}
                          onChange={this.handleScreenChange}
                        />
                      </div>
                    )
                  }
                >
                  {below('medium') && navigationItems.length < 2 && (
                    <MenuButton
                      onClick={this.handleMenuPanelOpen}
                      css={`
                        position: relative;
                        z-index: 2;
                        margin-left: 0;
                        margin-right: -24px;
                      `}
                    />
                  )}
                  <NavigationBar
                    items={navigationItems}
                    onBack={this.handleCloseRepo}
                  />
                  {canUpgradeOrg && !openedRepoName && (
                    <UpgradeButton
                      mode={below('medium') ? 'text' : 'strong'}
                      onClick={onUpgradeAll}
                      title="Upgrade all"
                    >
                      {below('medium') ? <IconUpgrade /> : 'Upgrade all'}
                    </UpgradeButton>
                  )}
                </AppBar>
              )}
            </Viewport>
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
          onUpgrade={this.handleUpgradeApp}
        />
      </React.Fragment>
    )
  }
}

const UpgradeButton = styled(Button)`
  position: absolute;
  right: 0px;
  margin-right: 30px;
}
`

export default AppCenter
