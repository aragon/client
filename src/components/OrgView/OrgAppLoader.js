import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import App404 from '../App404/App404'
import { AppCenter, Console, Home, Organization, Permissions } from '../../apps'
import AppIFrame from '../App/AppIFrame'
import AppInternal from '../App/AppInternal'
import AppLoader from '../App/AppLoader'
import { useIdentity } from '../IdentityManager/IdentityManager'

import { addressesEqual } from '../../web3-utils'

import {
  AppInstanceGroupType,
  AppsStatusType,
  AppType,
  AragonType,
  DaoAddressType,
  DaoStatusType,
  RepoType,
} from '../../prop-types'
import { DAO_STATUS_LOADING, APPS_STATUS_LOADING } from '../../symbols'

function OrgAppLoader({
  apps,
  appsStatus,
  daoStatus,
  locator,
  wrapper,
  ...props
}) {
  const [appLoading, setAppLoading] = useState(false)

  const currentApp = useMemo(
    () =>
      apps.find(app => addressesEqual(app.proxyAddress, locator.instanceId)),
    [apps, locator.instanceId]
  )

  return (
    <AppLoader
      appLoading={appLoading}
      appsLoading={!wrapper || appsStatus === APPS_STATUS_LOADING}
      currentAppName={currentApp ? currentApp.name : ''}
      daoLoading={daoStatus === DAO_STATUS_LOADING}
      instanceId={locator.instanceId}
    >
      <Apps
        appsStatus={appsStatus}
        daoStatus={daoStatus}
        locator={locator}
        setAppLoading={setAppLoading}
        wrapper={wrapper}
        {...props}
      />
    </AppLoader>
  )
}

function Apps({
  apps,
  appInstanceGroups,
  appsStatus,
  canUpgradeOrg,
  daoAddress,
  historyBack,
  locator,
  permissionsLoading,
  onOpenApp,
  onShowOrgUpgradePanel,
  onUpgradeModalOpen,
  repos,
  setAppLoading,
  wrapper,
}) {
  const { identityEvents$ } = useIdentity()
  const appIFrameRef = useRef(null)
  const identitySubscription = useRef(null)

  const { instanceId, instancePath } = locator
  const appsLoading = appsStatus === APPS_STATUS_LOADING
  const reposLoading = appsLoading || Boolean(apps.length && !repos.length)

  const handleAppIFrameRef = useCallback(appIFrame => {
    appIFrameRef.current = appIFrame
  }, [])

  const handleAppIFrameLoadingStart = useCallback(
    event => {
      setAppLoading(true)
    },
    [setAppLoading]
  )
  const handleAppIFrameLoadingCancel = useCallback(
    event => {
      setAppLoading(false)
    },
    [setAppLoading]
  )
  const handleAppIFrameLoadingError = useCallback(
    event => {
      setAppLoading(false)
    },
    [setAppLoading]
  )

  const handleAppIFrameLoadingSuccess = useCallback(
    async ({ iframeElement }) => {
      if (!wrapper) {
        console.error(
          `Attempted to connect app (${instanceId}) before aragonAPI was ready`
        )
        return
      }
      if (!apps.find(app => addressesEqual(app.proxyAddress, instanceId))) {
        console.error(
          `The requested app (${instanceId}) could not be found in the installed apps`
        )
        return
      }

      await wrapper.connectAppIFrame(iframeElement, instanceId)

      appIFrameRef.current.sendMessage({
        from: 'wrapper',
        name: 'ready',
        value: true,
      })
      setAppLoading(false)
    },
    [apps, instanceId, setAppLoading, wrapper]
  )

  const handleAppMessage = useCallback(
    ({ data: { name } }) => {
      if (name === 'ready') {
        wrapper.setAppPath(instanceId, instancePath)
      }
    },
    [instanceId, instancePath, wrapper]
  )

  // Update the local path of the current instance
  const handlePathRequest = useCallback(
    instancePath => {
      onOpenApp(instanceId, { instancePath })
    },
    [instanceId, onOpenApp]
  )

  useEffect(() => {
    identitySubscription.current = identityEvents$.subscribe(event => {
      if (appIFrameRef.current) {
        appIFrameRef.current.reloadIframe()
      }
    })

    if (wrapper) {
      wrapper.setAppPath(locator.instanceId, locator.instancePath)
    }

    return () => {
      identitySubscription.current.unsubscribe()
    }
  }, [identityEvents$, locator.instanceId, locator.instancePath, wrapper])

  if (instanceId === 'home') {
    return (
      <AppInternal>
        <Home apps={apps} onOpenApp={onOpenApp} />
      </AppInternal>
    )
  }

  if (instanceId === 'permissions') {
    return (
      <AppInternal>
        <Permissions
          apps={apps}
          appsLoading={appsLoading}
          permissionsLoading={permissionsLoading}
          localPath={instancePath}
          onMessage={handleAppMessage}
          onPathRequest={handlePathRequest}
          wrapper={wrapper}
        />
      </AppInternal>
    )
  }

  if (instanceId === 'apps') {
    return (
      <AppInternal>
        <AppCenter
          appInstanceGroups={appInstanceGroups}
          daoAddress={daoAddress}
          repos={repos}
          canUpgradeOrg={canUpgradeOrg}
          reposLoading={reposLoading}
          onMessage={handleAppMessage}
          onUpgradeAll={onShowOrgUpgradePanel}
          localPath={instancePath}
          onPathRequest={handlePathRequest}
          wrapper={wrapper}
        />
      </AppInternal>
    )
  }

  if (instanceId === 'organization') {
    return (
      <AppInternal>
        <Organization
          apps={apps}
          appsLoading={appsLoading}
          canUpgradeOrg={canUpgradeOrg}
          dao={locator.dao}
          daoAddress={daoAddress}
          onMessage={handleAppMessage}
          onOpenApp={onOpenApp}
          onShowOrgVersionDetails={onUpgradeModalOpen}
        />
      </AppInternal>
    )
  }

  if (instanceId === 'console') {
    return (
      <AppInternal>
        <Console apps={apps} wrapper={wrapper} />
      </AppInternal>
    )
  }

  // AppLoader will display a loading screen in that case
  if (!wrapper || appsLoading) {
    return null
  }

  const app = apps.find(app => addressesEqual(app.proxyAddress, instanceId))

  return app ? (
    <AppIFrame
      ref={handleAppIFrameRef}
      app={app}
      onLoadingCancel={handleAppIFrameLoadingCancel}
      onLoadingError={handleAppIFrameLoadingError}
      onLoadingStart={handleAppIFrameLoadingStart}
      onLoadingSuccess={handleAppIFrameLoadingSuccess}
      onMessage={handleAppMessage}
    />
  ) : (
    <App404 onNavigateBack={historyBack} />
  )
}

OrgAppLoader.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  appInstanceGroups: PropTypes.arrayOf(AppInstanceGroupType).isRequired,
  appsStatus: AppsStatusType.isRequired,
  canUpgradeOrg: PropTypes.bool,
  daoAddress: DaoAddressType.isRequired,
  daoStatus: DaoStatusType.isRequired,
  historyBack: PropTypes.func.isRequired,
  locator: PropTypes.object,
  permissionsLoading: PropTypes.bool,
  repos: PropTypes.arrayOf(RepoType).isRequired,
  wrapper: AragonType,
}

Apps.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  appInstanceGroups: PropTypes.arrayOf(AppInstanceGroupType).isRequired,
  appsStatus: AppsStatusType.isRequired,
  canUpgradeOrg: PropTypes.bool,
  daoAddress: DaoAddressType.isRequired,
  historyBack: PropTypes.func.isRequired,
  locator: PropTypes.object,
  onOpenApp: PropTypes.func.isRequired,
  onShowOrgUpgradePanel: PropTypes.func.isRequired,
  onUpgradeModalOpen: PropTypes.func.isRequired,
  permissionsLoading: PropTypes.bool,
  repos: PropTypes.arrayOf(RepoType).isRequired,
  setAppLoading: PropTypes.func.isRequired,
  wrapper: AragonType,
}

export default OrgAppLoader
