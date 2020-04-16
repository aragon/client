import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import memoize from 'lodash.memoize'
import { AppCenter, Console, Home, Organization, Permissions } from './apps'
import App404 from './components/App404/App404'
import AppIFrame from './components/App/AppIFrame'
import AppInternal from './components/App/AppInternal'
import AppLoader from './components/App/AppLoader'
import OrgView from './components/OrgView/OrgView'
import SignerPanel from './components/SignerPanel/SignerPanel'
import UpgradeBanner from './components/Upgrade/UpgradeBanner'
import UpgradeModal from './components/Upgrade/UpgradeModal'
import UpgradeOrganizationPanel from './components/Upgrade/UpgradeOrganizationPanel'
import { useIdentity } from './components/IdentityManager/IdentityManager'
import {
  AppType,
  AppsStatusType,
  AragonType,
  DaoAddressType,
  DaoStatusType,
  RepoType,
} from './prop-types'
import { useRouting } from './routing'
import { APPS_STATUS_LOADING, DAO_STATUS_LOADING } from './symbols'
import { addressesEqual } from './web3-utils'

class Wrapper extends React.PureComponent {
  static propTypes = {
    apps: PropTypes.arrayOf(AppType).isRequired,
    appsStatus: AppsStatusType.isRequired,
    canUpgradeOrg: PropTypes.bool,
    connected: PropTypes.bool,
    daoAddress: DaoAddressType.isRequired,
    daoStatus: DaoStatusType.isRequired,
    historyBack: PropTypes.func.isRequired,
    identityEvents$: PropTypes.object.isRequired,
    permissionsLoading: PropTypes.bool.isRequired,
    repos: PropTypes.arrayOf(RepoType).isRequired,
    routing: PropTypes.object.isRequired,
    transactionBag: PropTypes.object,
    signatureBag: PropTypes.object,
    visible: PropTypes.bool.isRequired,
    web3: PropTypes.object,
    wrapper: AragonType,
  }

  static defaultProps = {
    connected: false,
    transactionBag: null,
    signatureBag: null,
  }

  state = {
    appLoading: false,
    orgUpgradePanelOpened: false,
    upgradeModalOpened: false,
  }

  identitySubscription = null

  componentDidMount() {
    this.startIdentitySubscription()
  }

  componentWillUnmount() {
    this.identitySubscription.unsubscribe()
  }

  componentDidUpdate(prevProps) {
    this.updateIdentityEvents(prevProps)
    this.updateInstancePath(prevProps)
  }

  updateInstancePath(prevProps) {
    const { routing, wrapper } = this.props

    const { mode } = routing
    const { mode: prevMode } = prevProps.routing || {}

    if (!wrapper || mode.name !== 'org' || mode.instanceId === null) {
      return
    }

    const update =
      mode.instanceId !== prevMode.instanceId ||
      mode.instancePath !== prevMode.instancePath

    if (update) {
      wrapper.setAppPath(mode.instanceId, mode.instancePath)
    }
  }

  getAppInstancesGroups = memoize(apps =>
    apps.reduce((groups, app) => {
      const group = groups.find(({ appId }) => appId === app.appId)

      const {
        // This is not technically fully true, but let's assume that only these
        // aspects are different between multiple instances of the same app
        codeAddress: instanceCodeAddress,
        identifier: instanceIdentifier,
        proxyAddress: instanceProxyAddress,
        ...sharedAppInfo
      } = app

      const instance = {
        codeAddress: instanceCodeAddress,
        identifier: instanceIdentifier,
        instanceId: instanceProxyAddress,
        proxyAddress: instanceProxyAddress,
      }

      // Append the instance to the existing app group
      if (group) {
        group.instances.push(instance)
        return groups
      }

      return groups.concat([
        {
          app: sharedAppInfo,
          appId: app.appId,
          name: app.name,
          instances: [instance],
          hasWebApp: app.hasWebApp,
          repoName: app.appName,
        },
      ])
    }, [])
  )

  updateIdentityEvents(prevProps) {
    const { identityEvents$ } = this.props
    if (identityEvents$ !== prevProps.identityEvents$) {
      this.stopIdentitySubscription()
      this.startIdentitySubscription()
    }
  }

  startIdentitySubscription() {
    const { identityEvents$ } = this.props
    this.identitySubscription = identityEvents$.subscribe(event => {
      if (this.appIFrame) {
        this.appIFrame.reloadIframe()
      }
    })
  }

  stopIdentitySubscription() {
    if (this.identitySubscription) {
      this.identitySubscription.unsubscribe()
    }
  }

  openApp = (instanceId, { instancePath } = {}) => {
    this.props.routing.update(({ mode }) => ({
      mode: { ...mode, instanceId, instancePath },
    }))
  }

  handleAppIFrameRef = appIFrame => {
    this.appIFrame = appIFrame
  }

  handleAppIFrameLoadingSuccess = async ({ iframeElement }) => {
    const { apps, wrapper, routing } = this.props
    const { instanceId } = routing.mode

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

    this.appIFrame.sendMessage({
      from: 'wrapper',
      name: 'ready',
      value: true,
    })
    this.setState({ appLoading: false })
  }
  handleAppIFrameLoadingStart = event => {
    this.setState({ appLoading: true })
  }
  handleAppIFrameLoadingCancel = event => {
    this.setState({ appLoading: false })
  }
  handleAppIFrameLoadingError = event => {
    this.setState({ appLoading: false })
  }

  handleAppMessage = ({ data: { name, value } }) => {
    const { wrapper, routing } = this.props
    const { mode } = routing
    if (name === 'ready' && mode.name === 'org') {
      wrapper.setAppPath(mode.instanceId, mode.instancePath)
    }
  }

  // Update the local path of the current instance
  handlePathRequest = instancePath => {
    const { mode } = this.props.routing
    if (mode.name === 'org') {
      this.openApp(mode.instanceId, { instancePath })
    }
  }

  handleUpgradeModalOpen = () => {
    this.setState({
      upgradeModalOpened: true,
    })
  }
  handleUpgradeModalClose = () => {
    this.setState({
      upgradeModalOpened: false,
    })
  }
  showOrgUpgradePanel = () => {
    this.setState({
      // Only open the upgrade panel if the org can be upgraded
      orgUpgradePanelOpened: this.props.canUpgradeOrg,
      upgradeModalOpened: false,
    })
  }
  hideOrgUpgradePanel = () => {
    this.setState({ orgUpgradePanelOpened: false })
  }

  render() {
    const {
      apps,
      appsStatus,
      canUpgradeOrg,
      connected,
      daoAddress,
      daoStatus,
      repos,
      routing,
      signatureBag,
      transactionBag,
      visible,
      web3,
      wrapper,
    } = this.props
    const { appLoading, orgUpgradePanelOpened, upgradeModalOpened } = this.state
    const { mode } = routing

    const currentApp = apps.find(app =>
      addressesEqual(app.proxyAddress, mode.instanceId)
    )

    return (
      <div
        css={`
          display: ${visible ? 'flex' : 'none'};
          flex-direction: column;
          position: relative;
          z-index: 0;
          height: 100vh;
          min-width: 360px;
        `}
      >
        <BannerWrapper>
          <UpgradeBanner
            visible={canUpgradeOrg}
            onMoreInfo={this.handleUpgradeModalOpen}
          />
        </BannerWrapper>

        <OrgView
          appInstanceGroups={this.getAppInstancesGroups(apps)}
          apps={apps}
          appsStatus={appsStatus}
          connected={connected}
          daoAddress={daoAddress}
          daoStatus={daoStatus}
          onOpenApp={this.openApp}
        >
          <AppLoader
            appLoading={appLoading}
            appsLoading={!wrapper || appsStatus === APPS_STATUS_LOADING}
            currentAppName={currentApp ? currentApp.name : ''}
            daoLoading={daoStatus === DAO_STATUS_LOADING}
            instanceId={mode.instanceId}
          >
            {this.renderApp(mode.instanceId, mode.instancePath)}
          </AppLoader>

          <SignerPanel
            apps={apps}
            transactionBag={transactionBag}
            signatureBag={signatureBag}
            web3={web3}
          />

          {canUpgradeOrg && (
            <UpgradeOrganizationPanel
              daoAddress={daoAddress}
              opened={orgUpgradePanelOpened}
              onClose={this.hideOrgUpgradePanel}
              repos={repos}
              wrapper={wrapper}
            />
          )}
        </OrgView>

        <UpgradeModal
          visible={upgradeModalOpened}
          onClose={this.handleUpgradeModalClose}
          onUpgrade={this.showOrgUpgradePanel}
          canUpgradeOrg={canUpgradeOrg}
        />
      </div>
    )
  }
  renderApp(instanceId, instancePath) {
    const {
      apps,
      appsStatus,
      canUpgradeOrg,
      daoAddress,
      permissionsLoading,
      repos,
      wrapper,
    } = this.props

    const appsLoading = appsStatus === APPS_STATUS_LOADING
    const reposLoading = appsLoading || Boolean(apps.length && !repos.length)

    if (instanceId === 'home') {
      return (
        <AppInternal>
          <Home apps={apps} onOpenApp={this.openApp} />
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
            onMessage={this.handleAppMessage}
            onPathRequest={this.handlePathRequest}
            wrapper={wrapper}
          />
        </AppInternal>
      )
    }

    if (instanceId === 'apps') {
      return (
        <AppInternal>
          <AppCenter
            appInstanceGroups={this.getAppInstancesGroups(apps)}
            daoAddress={daoAddress}
            repos={repos}
            canUpgradeOrg={canUpgradeOrg}
            reposLoading={reposLoading}
            onMessage={this.handleAppMessage}
            onUpgradeAll={this.showOrgUpgradePanel}
            localPath={instancePath}
            onPathRequest={this.handlePathRequest}
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
            daoAddress={daoAddress}
            onMessage={this.handleAppMessage}
            onOpenApp={this.openApp}
            onShowOrgVersionDetails={this.handleUpgradeModalOpen}
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
        ref={this.handleAppIFrameRef}
        app={app}
        onLoadingCancel={this.handleAppIFrameLoadingCancel}
        onLoadingError={this.handleAppIFrameLoadingError}
        onLoadingStart={this.handleAppIFrameLoadingStart}
        onLoadingSuccess={this.handleAppIFrameLoadingSuccess}
        onMessage={this.handleAppMessage}
      />
    ) : (
      <App404 onNavigateBack={this.props.historyBack} />
    )
  }
}

const BannerWrapper = styled.div`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
`

export default props => {
  const { identityEvents$ } = useIdentity()
  const routing = useRouting()
  return (
    <Wrapper {...props} routing={routing} identityEvents$={identityEvents$} />
  )
}
