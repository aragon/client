import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import { Main } from '@aragon/ui'
import App from './App'
import GlobalErrorHandler from './GlobalErrorHandler'
import { ClientThemeProvider, useClientTheme } from './client-theme'
import { WalletProvider, WalletBlockNumberProvider } from './wallet'
import {
  getLastPackageVersion,
  getPackageVersion,
  setPackageVersion,
} from './local-settings'
import { ConsoleVisibleProvider } from './apps/Console/useConsole'
import { HelpScoutProvider } from './components/HelpScoutBeacon/useHelpScout'
const packageVersion = getPackageVersion()
const lastPackageVersion = getLastPackageVersion()

const [currentMajorVersion, currentMinorVersion] = packageVersion.split('.')
const [lastMajorVersion, lastMinorVersion] = lastPackageVersion.split('.')

// Setting a package version also clears all local storage data.
if (
  lastMajorVersion !== currentMajorVersion ||
  lastMinorVersion !== currentMinorVersion
) {
  // Purge localstorage when upgrading between different minor versions.
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
      <HelpScoutProvider>
        <ConsoleVisibleProvider>
          <GlobalErrorHandler>
            <WalletBlockNumberProvider>
              <WalletProvider>
                <App />
              </WalletProvider>
            </WalletBlockNumberProvider>
          </GlobalErrorHandler>
        </ConsoleVisibleProvider>
      </HelpScoutProvider>
    </Main>
  )
}

ReactDOM.render(
  <ClientThemeProvider>
    <Providers />
  </ClientThemeProvider>,
  document.getElementById('root')
)
