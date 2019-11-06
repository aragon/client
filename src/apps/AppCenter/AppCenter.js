import React from 'react'
import PropTypes from 'prop-types'
import { Button, Header, IconRefresh, Tabs, useLayout } from '@aragon/ui'
import InstalledApps from './InstalledApps/InstalledApps'
import DiscoverApps from './DiscoverApps/DiscoverApps'
import UpgradeAppPanel from './UpgradeAppPanel'
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
  static defaultProps = {
    canUpgradeOrg: false,
  }
  static propTypes = {
    appInstanceGroups: PropTypes.arrayOf(AppInstanceGroupType).isRequired,
    daoAddress: DaoAddressType.isRequired,
    compactMode: PropTypes.bool,
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
        // Use latest version's assets
        baseUrl: repoBaseUrl(repo.appId, repo.latestVersion),
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
    const {
      compactMode,
      reposLoading,
      onUpgradeAll,
      canUpgradeOrg,
    } = this.props
    const { upgradePanelOpened } = this.state
    const { activeTab, openedRepoName } = this.getLocation()
    const repos = this.getRepos()
    const currentRepo = openedRepoName && this.getRepoFromName(openedRepoName)

    return (
      <React.Fragment>
        <Header
          primary="App center"
          secondary={
            canUpgradeOrg &&
            activeTab !== 1 &&
            !openedRepoName && (
              <Button
                mode="strong"
                onClick={onUpgradeAll}
                label="Upgrade to 0.8"
                icon={<IconRefresh />}
                display={compactMode ? 'icon' : 'label'}
              />
            )
          }
        />
        {!openedRepoName && (
          <Tabs
            items={SCREENS.map(screen => screen.label)}
            selected={activeTab}
            onChange={this.handleScreenChange}
          />
        )}
        {activeTab === 0 &&
          (reposLoading ? (
            <EmptyBlock>Loading apps…</EmptyBlock>
          ) : (
            <InstalledApps
              onOpenApp={this.handleOpenRepo}
              onRequestUpgrade={this.handleOpenUpgradePanel}
              openedRepoId={currentRepo && currentRepo.appId}
              repos={repos}
              onCloseRepo={this.handleCloseRepo}
            />
          ))}
        {activeTab === 1 && <DiscoverApps />}

        <UpgradeAppPanel
          repo={upgradePanelOpened ? currentRepo : null}
          onClose={this.handleCloseUpgradePanel}
          onUpgrade={this.handleUpgradeApp}
        />
      </React.Fragment>
    )
  }
}

export default React.memo(props => {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  return <AppCenter {...props} compactMode={compactMode} />
})
