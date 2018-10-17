import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { PublicUrl, BaseStyles } from '@aragon/ui'
import GlobalErrorHandler from './GlobalErrorHandler'
import App from './App'

ReactDOM.render(
  <PublicUrl.Provider url="./aragon-ui/">
    <BaseStyles />

    <GlobalErrorHandler>
      <App />
    </GlobalErrorHandler>
  </PublicUrl.Provider>,
  document.getElementById('root')
)
