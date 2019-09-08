import React from 'react'
import PropTypes from 'prop-types'
import { BaseStyles, GU, PublicUrl } from '@aragon/ui'
import * as Sentry from '@sentry/browser'
import GenericError from './components/Error/GenericError'
import DAONotFoundError from './components/Error/DAONotFoundError'
import { network } from './environment'
import { DAONotFound } from './errors'
import { getSentryDsn } from './local-settings'
import eagleSvg from './assets/eagle.svg'
import logo from './assets/logo.png'

const SENTRY_DSN = getSentryDsn()
const PACKAGE_VERSION = process.env.REACT_APP_PACKAGE_VERSION || ''
const EAGLE_DIMENSIONS = [1307, 877]

class GlobalErrorHandler extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  }
  state = { error: null, errorStack: null }
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorStack: errorInfo.componentStack
        .replace(/^\n+|\n+$/g, '')
        .replace(/^ {4}/gm, ''),
    })

    // Once this point is reached, the app can not recover because the routing
    // system, being below this component in the tree, is not functional
    // anymore. To make hash changes work despite this (e.g. by pressing the
    // back button in the browser), the page need to be reloaded.
    window.removeEventListener('hashchange', this.handleHashchange)
    window.addEventListener('hashchange', this.handleHashchange)
  }
  componentWillUnmount() {
    window.removeEventListener('hashchange', this.handleHashchange)
  }
  handleReportClick = () => {
    Sentry.init({
      dsn: SENTRY_DSN,
      release: PACKAGE_VERSION,
      environment: network.type,
    })
    const eventId = Sentry.captureException(this.state.error)
    Sentry.showReportDialog({ eventId })
  }
  handleHashchange = () => {
    window.location.reload()
  }
  render() {
    const { error, errorStack } = this.state

    if (!error) {
      return this.props.children
    }
    return (
      <PublicUrl.Provider url="/aragon-ui/">
        <BaseStyles />
        <div
          css={`
            height: 100vh;
            overflow: auto;
            background: fixed 50% 100% / ${EAGLE_DIMENSIONS[0]}px
              ${EAGLE_DIMENSIONS[1]}px no-repeat url(${eagleSvg});
          `}
        >
          <img
            src={logo}
            css={`
              position: absolute;
              top: ${2 * GU}px;
              left: ${2 * GU}px;
            `}
            alt="Logo"
          />
          <div
            css={`
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: -30px;
              padding: 50px 20px 20px;
              min-height: 100%;
            `}
          >
            {error instanceof DAONotFound ? (
              <DAONotFoundError dao={error.dao} />
            ) : (
              <GenericError
                detailsTitle={error.message}
                detailsContent={errorStack}
                reportCallback={SENTRY_DSN ? this.handleReportClick : null}
              />
            )}
          </div>
        </div>
      </PublicUrl.Provider>
    )
  }
}

export default GlobalErrorHandler
