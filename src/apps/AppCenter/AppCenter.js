import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Header, IconRefresh, Tabs } from '@aragon/ui'
import {
  AppInstanceGroupType,
  AragonType,
  DaoAddressType,
  RepoType,
} from '../../prop-types'
import { log, removeStartingSlash } from '../../util/utils'
import { repoBaseUrl } from '../../util/url'
import { KERNEL_APP_BASE_NAMESPACE } from '../../util/aragonos'
import InstalledApps from './InstalledApps/InstalledApps'
import DiscoverApps from './DiscoverApps/DiscoverApps'
import UpgradeAppPanel from './UpgradeAppPanel'
import EmptyBlock from './EmptyBlock'
import { useWallet } from '../../contexts/wallet'

function getLocation(localPath, extendedRepos) {
  const defaultScreen = { screen: 'installed' }

  if (!localPath) {
    return defaultScreen
  }

  const [screen, data = null] = removeStartingSlash(localPath).split('/')

  if (screen === 'installed') {
    return {
      screen,
      openedRepo: (data && getRepoFromName(extendedRepos, data)) || null,
    }
  }

  if (screen === 'discover') {
    return { screen }
  }

  return defaultScreen
}

function useUpgradeApp(wrapper, kernelAddress, { onDone }) {
  const upgradeApp = useCallback(
    async (appId, appAddress) => {
      log('setApp', appId, appAddress)

      // Calculate the path, if it exists
      const updatePath = await wrapper.getTransactionPath(
        kernelAddress, // destination (Kernel)
        'setApp', // method
        [KERNEL_APP_BASE_NAMESPACE, appId, appAddress] // params
      )

      // Try to perform the path
      wrapper.performTransactionPath(updatePath)

      if (onDone) {
        onDone()
      }
    },
    [wrapper, kernelAddress, onDone]
  )

  return upgradeApp
}

// Extend, cache and return the repos
function getExtendedRepos(appInstanceGroups, repos, networkType) {
  return repos.map(repo => {
    const appGroup = appInstanceGroups.find(
      appGroup => appGroup.appId === repo.appId
    )
    const { name, instances, repoName } = appGroup || {}

    return {
      ...repo,
      // Use latest version’s assets
      baseUrl: repoBaseUrl(repo.appId, repo.latestVersion, networkType),
      instances: instances || [],
      name: name || '',
      // if app was published missing content, repoName could be missing
      // use the latestVersion app name instead
      repoName: repoName || repo.latestVersion?.content?.appName || '',
    }
  })
}

function getRepoFromName(extendedRepos, name) {
  return extendedRepos.find(repo => repo.repoName === name)
}

const AppCenter = React.memo(function AppCenter({
  appInstanceGroups,
  canUpgradeOrg,
  compactMode,
  daoAddress,
  localPath,
  onPathRequest,
  onUpgradeAll,
  repos,
  reposLoading,
  wrapper,
}) {
  const [upgradePanelOpened, setUpgradePanelOpened] = useState(false)
  const { networkType, chainId } = useWallet()

  const SCREENS = useMemo(() => {
    let result = [{ id: 'installed', label: 'Installed apps' }]
    if (chainId === 1 || chainId === 4) {
      result = [...result, { id: 'discover', label: 'Discover apps' }]
    }
    return result
  }, [chainId])

  const extendedRepos = useMemo(
    () => getExtendedRepos(appInstanceGroups, repos, networkType),
    [appInstanceGroups, repos, networkType]
  )

  const { screen, openedRepo } = getLocation(localPath, extendedRepos)

  const openUpgradePanel = useCallback(() => {
    setUpgradePanelOpened(true)
  }, [])

  const closeUpgradePanel = useCallback(() => {
    setUpgradePanelOpened(false)
  }, [])

  const upgradeApp = useUpgradeApp(wrapper, daoAddress.address, {
    onDone() {
      closeUpgradePanel()
    },
  })

  const changeScreen = useCallback(
    screenIndex => {
      onPathRequest(`/${SCREENS[screenIndex].id}`)
    },
    [onPathRequest, SCREENS]
  )

  const handleOpenRepo = useCallback(
    repoName => {
      onPathRequest(`/installed/${repoName}`)
    },
    [onPathRequest]
  )

  const handleCloseRepo = useCallback(() => {
    onPathRequest(`/installed`)
  }, [onPathRequest])

  return (
    <React.Fragment>
      <Header
        primary="App Center"
        secondary={
          canUpgradeOrg &&
          screen !== 'discover' &&
          !openedRepo && (
            <Button
              mode="strong"
              onClick={onUpgradeAll}
              label="Upgrade to 0.8"
              icon={<IconRefresh />}
            />
          )
        }
      />
      {!openedRepo && (
        <Tabs
          items={SCREENS.map(screen => screen.label)}
          selected={SCREENS.findIndex(s => s.id === screen)}
          onChange={changeScreen}
        />
      )}
      {screen === 'installed' &&
        (reposLoading ? (
          <EmptyBlock>Loading apps…</EmptyBlock>
        ) : (
          <InstalledApps
            onOpenApp={handleOpenRepo}
            onRequestUpgrade={openUpgradePanel}
            openedRepoId={openedRepo && openedRepo.appId}
            repos={extendedRepos}
            onCloseRepo={handleCloseRepo}
          />
        ))}
      {screen === 'discover' && <DiscoverApps />}

      <UpgradeAppPanel
        repo={upgradePanelOpened ? openedRepo : null}
        onClose={closeUpgradePanel}
        onUpgrade={upgradeApp}
      />
    </React.Fragment>
  )
})

AppCenter.propTypes = {
  appInstanceGroups: PropTypes.arrayOf(AppInstanceGroupType).isRequired,
  canUpgradeOrg: PropTypes.bool.isRequired,
  compactMode: PropTypes.bool,
  daoAddress: DaoAddressType.isRequired,
  localPath: PropTypes.string,
  onPathRequest: PropTypes.func.isRequired,
  onUpgradeAll: PropTypes.func.isRequired,
  repos: PropTypes.arrayOf(RepoType).isRequired,
  reposLoading: PropTypes.bool.isRequired,
  wrapper: AragonType,
}

AppCenter.defaultProps = {
  canUpgradeOrg: false,
}

export default AppCenter
