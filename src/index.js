import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import { Main } from '@aragon/ui'
import App from './App'
import GlobalErrorHandler from './GlobalErrorHandler'
import { WalletProvider } from './contexts/wallet'
import { ClientThemeProvider, useClientTheme } from './client-theme'
import {
  getLastPackageVersion,
  getPackageVersion,
  setPackageVersion,
} from './local-settings'
import { RoutingProvider } from './routing'
import { ConsoleVisibleProvider } from './apps/Console/useConsole'
import { ClientWeb3Provider } from './contexts/ClientWeb3Context'
import { APMProvider } from './contexts/elasticAPM'

const packageVersion = getPackageVersion()
const lastPackageVersion = getLastPackageVersion()

const [currentMajorVersion] = packageVersion.split('.')
const [lastMajorVersion] = lastPackageVersion.split('.')

// Purge localstorage when upgrading between different major versions.
if (lastMajorVersion !== currentMajorVersion) {
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
      <APMProvider>
        <WalletProvider>
          <RoutingProvider>
            <ClientWeb3Provider>
              <ConsoleVisibleProvider>
                <GlobalErrorHandler>
                  <App />
                </GlobalErrorHandler>
              </ConsoleVisibleProvider>
            </ClientWeb3Provider>
          </RoutingProvider>
        </WalletProvider>
      </APMProvider>
    </Main>
  )
}

ReactDOM.render(
  <ClientThemeProvider>
    <Providers />
  </ClientThemeProvider>,
  document.getElementById('root')
)
