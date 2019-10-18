import React from 'react'
import PropTypes from 'prop-types'
import { createHashHistory as createHistory } from 'history'
import { Spring, animated } from 'react-spring'
import { useTheme } from '@aragon/ui'
import { network, web3Providers } from './environment'
import { parsePath, getAppPath, getPreferencesSearch } from './routing'
import initWrapper, {
  pollMainAccount,
  pollNetwork,
  pollConnectivity,
} from './aragonjs-wrapper'
import Wrapper from './Wrapper'
import { Onboarding } from './onboarding'
import { identifyProvider } from './ethereum-providers'
import { getWeb3, getUnknownBalance, getIsContractAccount } from './web3-utils'
import { enableWallet } from './wallet-utils'
import { log } from './utils'
import { ActivityProvider } from './contexts/ActivityContext'
import { FavoriteDaosProvider } from './contexts/FavoriteDaosContext'
import { PermissionsProvider } from './contexts/PermissionsContext'
import { IdentityProvider } from './components/IdentityManager/IdentityManager'
import { LocalIdentityModalProvider } from './components/LocalIdentityModal/LocalIdentityModalManager'
import LocalIdentityModal from './components/LocalIdentityModal/LocalIdentityModal'
import HelpScoutBeacon from './components/HelpScoutBeacon/HelpScoutBeacon'
import GlobalPreferences from './components/GlobalPreferences/GlobalPreferences'
import CustomToast from './components/CustomToast/CustomToast'
import { AccountProvider } from './account'

import { isKnownRepo } from './repo-utils'
import {
  APP_MODE_START,
  APP_MODE_ORG,
  APP_MODE_SETUP,
  APPS_STATUS_ERROR,
  APPS_STATUS_READY,
  APPS_STATUS_LOADING,
  APPS_STATUS_UNLOADED,
  DAO_STATUS_ERROR,
  DAO_STATUS_READY,
  DAO_STATUS_LOADING,
  DAO_STATUS_UNLOADED,
} from './symbols'

const INITIAL_DAO_STATE = {
  apps: [],
  appIdentifiers: {},
  appsStatus: APPS_STATUS_UNLOADED,
  daoAddress: { address: '', domain: '' },
  daoStatus: DAO_STATUS_UNLOADED,
  permissions: {},
  permissionsLoading: true,
  repos: [],
}

const SELECTOR_NETWORKS = [
  ['main', 'Ethereum Mainnet', 'https://mainnet.aragon.org/'],
  ['rinkeby', 'Ethereum Testnet (Rinkeby)', 'https://rinkeby.aragon.org/'],
]
if (network.type === 'ropsten') {
  SELECTOR_NETWORKS.push([
    'ropsten',
    'Ethereum Testnet (Ropsten)',
    'https://aragon.ropsten.aragonpm.com/',
  ])
}

class App extends React.Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
  }

  state = {
    ...INITIAL_DAO_STATE,
    account: '',
    balance: getUnknownBalance(),
    connected: false,
    fatalError: null,
    identityIntent: null,
    isContractAccount: null,
    locator: {},
    prevLocator: null,
    selectorNetworks: SELECTOR_NETWORKS,
    transactionBag: null,
    signatureBag: null,
    walletNetwork: '',
    walletProviderId: identifyProvider(web3Providers.wallet),
    walletWeb3: getWeb3(web3Providers.wallet),
    web3: getWeb3(web3Providers.default),
    wrapper: null,
  }

  history = createHistory()

  componentDidMount() {
    const { pathname, search } = this.history.location
    this.handleHistoryChange({ pathname, search })
    this.history.listen(this.handleHistoryChange)

    pollMainAccount(web3Providers.wallet, {
      onAccount: (account = null) => {
        this.setState({ account })
        if (account && this.state.wrapper) {
          this.state.wrapper.setAccounts([account])
        }

        if (account) {
          getIsContractAccount(getWeb3(web3Providers.wallet))
            .then(isContractAccount => this.setState({ isContractAccount }))
            .catch(err => {
              log("Error fetching account's code", err)
            })
        }
      },
      onBalance: balance => {
        this.setState({ balance })
      },
    })

    pollNetwork(web3Providers.wallet, walletNetwork => {
      this.setState({ walletNetwork })
    })

    // Only the default, because the app can work without the wallet
    pollConnectivity([web3Providers.default], connected => {
      this.setState({ connected })
    })
  }

  // Handle URL changes
  handleHistoryChange = ({ pathname, search, state = {} }) => {
    if (!state.alreadyParsed) {
      this.updateLocator(parsePath(this.history, pathname, search))
    }
  }

  // Change the URL if needed
  historyPush = path => {
    if (path !== this.state.locator.path) {
      this.history.push(path)
    }
  }

  // Change the URL to the previous one
  historyBack = () => {
    if (this.state.prevLocator) {
      this.history.goBack()
    } else {
      this.history.replace('/')
    }
  }

  updateLocator = locator => {
    const { locator: prevLocator } = this.state

    // New DAO: need to reinit the wrapper
    if (locator.dao && (!prevLocator || locator.dao !== prevLocator.dao)) {
      this.updateDao(locator.dao)
    }

    // Moving from a DAO to somewhere else (like onboarding):
    // need to cancel the subscribtions.
    if (!locator.dao && prevLocator && prevLocator.dao) {
      this.updateDao(null)
    }

    this.setState({ locator, prevLocator })
  }

  updateDao(dao = null) {
    // Cancel the subscriptions / unload the wrapper
    if (this.state.wrapper) {
      this.state.wrapper.cancel()
      this.setState({ wrapper: null })
    }

    // Reset the DAO state
    this.setState({
      ...INITIAL_DAO_STATE,
    })

    if (dao === null) {
      return
    }

    // Loading state
    this.setState({
      appsStatus: APPS_STATUS_LOADING,
      daoStatus: DAO_STATUS_LOADING,
    })

    log('Init DAO', dao)
    initWrapper(dao, {
      provider: web3Providers.default,
      walletProvider: web3Providers.wallet,
      onDaoAddress: ({ address, domain }) => {
        log('dao address', address)
        log('dao domain', domain)
        this.setState({
          daoStatus: DAO_STATUS_READY,
          daoAddress: { address, domain },
        })
      },
      onWeb3: web3 => {
        log('web3', web3)
      },
      onApps: apps => {
        log('apps updated', apps)
        this.setState({
          apps,
          appsStatus: APPS_STATUS_READY,
        })
      },
      onPermissions: permissions => {
        log('permissions updated', permissions)
        this.setState({
          permissions,
          permissionsLoading: false,
        })
      },
      onForwarders: forwarders => {
        log('forwarders', forwarders)
      },
      onAppIdentifiers: appIdentifiers => {
        log('app identifiers', appIdentifiers)
        this.setState({ appIdentifiers })
      },
      onInstalledRepos: repos => {
        log('installed repos', repos)
        const canUpgradeOrg = repos.some(
          ({ appId, currentVersion, latestVersion }) =>
            isKnownRepo(appId) &&
            currentVersion.version.split('.')[0] <
              latestVersion.version.split('.')[0]
        )
        this.setState({ canUpgradeOrg, repos })
      },
      onTransaction: transactionBag => {
        log('transaction bag', transactionBag)
        this.setState({ transactionBag })
      },
      onSignatures: signatureBag => {
        log('signature bag', signatureBag)
        this.setState({ signatureBag })
      },
      onIdentityIntent: async identityIntent => {
        // set the state for modifying a specific address identity
        let name = null
        try {
          const identity = await this.handleIdentityResolve(
            identityIntent.address
          )
          name = identity.name
        } catch (_) {}
        this.setState({
          identityIntent: {
            label: name,
            ...identityIntent,
          },
        })
      },
    })
      .then(wrapper => {
        log('wrapper', wrapper)
        this.setState({ wrapper })
        return wrapper
      })
      .catch(err => {
        log(`Wrapper init, fatal error: ${err.name}. ${err.message}.`)
        this.setState({
          appsStatus: APPS_STATUS_ERROR,
          daoStatus: DAO_STATUS_ERROR,
          fatalError: err,
        })
      })
  }

  handleIdentityCancel = () => {
    const { identityIntent } = this.state
    identityIntent.reject(new Error('Identity modification cancelled'))
    this.setState({ identityIntent: null })
  }

  handleIdentitySave = ({ address, label }) => {
    const { identityIntent } = this.state
    this.state.wrapper
      .modifyAddressIdentity(address, { name: label })
      .then(identityIntent.resolve)
      .then(() => this.setState({ identityIntent: null }))
      .catch(identityIntent.reject)
  }

  handleIdentityResolve = address => {
    // returns promise
    if (this.state.wrapper) {
      return this.state.wrapper.resolveAddressIdentity(address)
    } else {
      // wrapper has not been initialized
      // re-request in 100 ms
      return new Promise(resolve => {
        setTimeout(async () => {
          resolve(await this.handleIdentityResolve(address))
        }, 100)
      })
    }
  }

  handleOpenLocalIdentityModal = address => {
    return this.state.wrapper.requestAddressIdentityModification(address)
  }

  closePreferences = () => {
    const { locator } = this.state
    this.historyPush(getAppPath(locator))
  }

  openPreferences = (screen, data) => {
    const { locator } = this.state
    this.historyPush(
      getAppPath({ ...locator, search: getPreferencesSearch(screen, data) })
    )
  }

  render() {
    const { theme } = this.props
    const {
      account,
      apps,
      appIdentifiers,
      appsStatus,
      balance,
      canUpgradeOrg,
      connected,
      daoAddress,
      daoStatus,
      fatalError,
      identityIntent,
      isContractAccount,
      locator,
      permissions,
      permissionsLoading,
      repos,
      selectorNetworks,
      transactionBag,
      signatureBag,
      walletNetwork,
      walletProviderId,
      walletWeb3,
      web3,
      wrapper,
    } = this.state

    const { mode } = locator
    const { address: intentAddress = null, label: intentLabel = '' } =
      identityIntent || {}

    if (!mode) {
      return null
    }
    if (fatalError !== null) {
      throw fatalError
    }

    const appsWithIdentifiers = apps.map(app => {
      const identifier = appIdentifiers[app.proxyAddress]
      return identifier
        ? {
            identifier,
            ...app,
          }
        : app
    })

    return (
      <Spring
        from={{ opacity: 0, scale: 0.98 }}
        to={{ opacity: 1, scale: 1 }}
        native
      >
        {({ opacity, scale }) => (
          <animated.div
            style={{
              opacity,
              background: theme.background,
            }}
          >
            <animated.div
              style={{
                transform: scale.interpolate(v => `scale3d(${v}, ${v}, 1)`),
              }}
            >
              <CustomToast>
                <IdentityProvider onResolve={this.handleIdentityResolve}>
                  <AccountProvider
                    account={account}
                    balance={balance}
                    isContract={isContractAccount}
                    walletNetwork={walletNetwork}
                    walletProviderId={walletProviderId}
                  >
                    <LocalIdentityModalProvider
                      onShowLocalIdentityModal={
                        this.handleOpenLocalIdentityModal
                      }
                    >
                      <LocalIdentityModal
                        address={intentAddress}
                        label={intentLabel}
                        opened={identityIntent !== null}
                        onCancel={this.handleIdentityCancel}
                        onSave={this.handleIdentitySave}
                      />
                      <FavoriteDaosProvider>
                        <ActivityProvider
                          account={account}
                          daoDomain={daoAddress.domain}
                          web3={web3}
                        >
                          <PermissionsProvider
                            wrapper={wrapper}
                            apps={appsWithIdentifiers}
                            permissions={permissions}
                          >
                            <div css="position: relative; z-index: 0">
                              <Wrapper
                                visible={mode === APP_MODE_ORG}
                                account={account}
                                apps={appsWithIdentifiers}
                                appsStatus={appsStatus}
                                canUpgradeOrg={canUpgradeOrg}
                                connected={connected}
                                daoAddress={daoAddress}
                                daoStatus={daoStatus}
                                historyBack={this.historyBack}
                                historyPush={this.historyPush}
                                locator={locator}
                                onRequestAppsReload={
                                  this.handleRequestAppsReload
                                }
                                onRequestEnable={enableWallet}
                                openPreferences={this.openPreferences}
                                permissionsLoading={permissionsLoading}
                                repos={repos}
                                signatureBag={signatureBag}
                                transactionBag={transactionBag}
                                walletNetwork={walletNetwork}
                                walletProviderId={walletProviderId}
                                walletWeb3={walletWeb3}
                                web3={web3}
                                wrapper={wrapper}
                              />
                            </div>
                          </PermissionsProvider>

                          <Onboarding
                            account={account}
                            balance={balance}
                            isContractAccount={isContractAccount}
                            selectorNetworks={selectorNetworks}
                            status={
                              mode === APP_MODE_START || mode === APP_MODE_SETUP
                                ? locator.action || 'welcome'
                                : 'none'
                            }
                            walletWeb3={walletWeb3}
                            web3={web3}
                          />

                          <GlobalPreferences
                            locator={locator}
                            wrapper={wrapper}
                            apps={appsWithIdentifiers}
                            onScreenChange={this.openPreferences}
                            onClose={this.closePreferences}
                          />

                          <HelpScoutBeacon locator={locator} apps={apps} />
                        </ActivityProvider>
                      </FavoriteDaosProvider>
                    </LocalIdentityModalProvider>
                  </AccountProvider>
                </IdentityProvider>
              </CustomToast>
            </animated.div>
          </animated.div>
        )}
      </Spring>
    )
  }
}

export default function(props) {
  const theme = useTheme()
  return <App theme={theme} {...props} />
}
