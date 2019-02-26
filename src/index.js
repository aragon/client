import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Main } from '@aragon/ui'
import GlobalErrorHandler from './GlobalErrorHandler'
import App from './App'

const PACKAGE_VERSION = process.env.REACT_APP_PACKAGE_VERSION || ''
const PACKAGE_VERSION_KEY = 'PACKAGE_VERSION_KEY'

// Purge localstorage cache when upgrading between different minor versions
const lastAppVersion = window.localStorage.getItem(PACKAGE_VERSION_KEY) || ''
const [lastMajorVersion, lastMinorVersion] = lastAppVersion.split('.')
const [currentMajorVersion, currentMinorVersion] = PACKAGE_VERSION.split('.')
if (
  lastMajorVersion !== currentMajorVersion ||
  lastMinorVersion !== currentMinorVersion
) {
  window.localStorage.clear()
  window.localStorage.setItem(PACKAGE_VERSION_KEY, PACKAGE_VERSION)

  // Attempt to clean up indexedDB storage as well
  if (
    window.indexedDB &&
    window.indexedDB.databases &&
    window.indexedDB.deleteDatabase
  ) {
    // eslint-disable-next-line promise/catch-or-return
    window.indexedDB.databases.then(databases =>
      databases.forEach(({ name }) => window.indexedDB.deleteDatabase(name))
    )
  }
}

ReactDOM.render(
  <GlobalErrorHandler>
    <Main>
      <App />
    </Main>
  </GlobalErrorHandler>,
  document.getElementById('root')
)
