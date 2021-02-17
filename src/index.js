import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import { Main } from '@aragon/ui'
import { Cache as WrapperCache } from '@aragon/wrapper'
import App from './App'
import { ClientStorage } from './cache'
import GlobalErrorHandler from './GlobalErrorHandler'
import { WalletProvider } from './wallet'
import { ClientThemeProvider, useClientTheme } from './client-theme'
import {
  getLastPackageVersion,
  getPackageVersion,
  setPackageVersion,
} from './local-settings'
import { RoutingProvider } from './routing'
import { ConsoleVisibleProvider } from './apps/Console/useConsole'
import initializeSentryIfEnabled from './sentry'
import { HelpScoutProvider } from './components/HelpScoutBeacon/useHelpScout'
import { ClientBlockNumberProvider } from './components/AccountModule/useClientBlockNumber'

// Initialize Sentry as early as possible, if enabled
initializeSentryIfEnabled()

const packageVersion = getPackageVersion()
const lastPackageVersion = getLastPackageVersion()

const [currentMajorVersion, currentMinorVersion] = packageVersion.split('.')
const [lastMajorVersion, lastMinorVersion] = lastPackageVersion.split('.')

// Purge localstorage when upgrading between different minor versions.
if (
  lastMajorVersion !== currentMajorVersion ||
  lastMinorVersion !== currentMinorVersion
) {
  ClientStorage.clear()
  WrapperCache.clearAllCaches()
}

// Save the current package version
if (packageVersion !== lastPackageVersion) {
  setPackageVersion(packageVersion)
}

function Providers() {
  const { appearance } = useClientTheme()
  return (
    <Main layout={false} scrollView={false} theme={appearance}>
      <RoutingProvider>
        <WalletProvider>
          <HelpScoutProvider>
            <ConsoleVisibleProvider>
              <GlobalErrorHandler>
                <ClientBlockNumberProvider>
                  <App />
                </ClientBlockNumberProvider>
              </GlobalErrorHandler>
            </ConsoleVisibleProvider>
          </HelpScoutProvider>
        </WalletProvider>
      </RoutingProvider>
    </Main>
  )
}

ReactDOM.render(
  <ClientThemeProvider>
    <Providers />
  </ClientThemeProvider>,
  document.getElementById('root')
)
