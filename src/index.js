import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Main } from '@aragon/ui'
import App from './App'
import GlobalErrorHandler from './GlobalErrorHandler'
import { getPackageVersion, getLastPackageVersion } from './local-settings'

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

ReactDOM.render(
  <GlobalErrorHandler>
    <Main layout={false} scrollView={false}>
      <App />
    </Main>
  </GlobalErrorHandler>,
  document.getElementById('root')
)
