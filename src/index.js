import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import { Main } from '@aragon/ui'
import App from './App'
import GlobalErrorHandler from './GlobalErrorHandler'
import {
  getLastPackageVersion,
  getPackageVersion,
  setPackageVersion,
} from './local-settings'
import { clearCache } from './utils'
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
  clearCache()
}

// Save the current package version
if (packageVersion !== lastPackageVersion) {
  setPackageVersion(packageVersion)
}

ReactDOM.render(
  <Main layout={false} scrollView={false}>
    <HelpScoutProvider>
      <GlobalErrorHandler>
        <App />
      </GlobalErrorHandler>
    </HelpScoutProvider>
  </Main>,
  document.getElementById('root')
)
