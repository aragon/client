import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { AragonApp } from '@aragon/ui'
import GlobalErrorHandler from './GlobalErrorHandler'
import App from './App'

ReactDOM.render(
  <AragonApp publicUrl="/aragon-ui/">
    <GlobalErrorHandler>
      <App />
    </GlobalErrorHandler>
  </AragonApp>,
  document.getElementById('root')
)
