import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import { Main } from '@aragon/ui'
import App from './App'
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
  window.localStorage.clear()

  // Attempt to clean up indexedDB storage as well.
  if (
    window.indexedDB &&
    window.indexedDB.databases &&
    window.indexedDB.deleteDatabase
  ) {
    // eslint-disable-next-line promise/catch-or-return
    window.indexedDB
      .databases()
      .then(databases =>
        databases.forEach(({ name }) => window.indexedDB.deleteDatabase(name))
      )
  }
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
          <ConsoleVisibleProvider>
            <GlobalErrorHandler>
              <ClientBlockNumberProvider>
                <App />
              </ClientBlockNumberProvider>
            </GlobalErrorHandler>
          </ConsoleVisibleProvider>
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
