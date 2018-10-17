import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { PublicUrl, BaseStyles } from '@aragon/ui'
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
}

ReactDOM.render(
  <PublicUrl.Provider url="./aragon-ui/">
    <BaseStyles />

    <GlobalErrorHandler>
      <App />
    </GlobalErrorHandler>
  </PublicUrl.Provider>,
  document.getElementById('root')
)
