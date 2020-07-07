import React from 'react'
import * as Sentry from '@sentry/browser'
import PropTypes from 'prop-types'
import GenericError from './components/Error/GenericError'
import DAONotFoundError from './components/Error/DAONotFoundError'
import { DAONotFound } from './errors'
import { isSentryEnabled } from './sentry'
import ErrorScreen from './components/Error/ErrorScreen'

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
    const eventId = Sentry.captureException(this.state.error)
    Sentry.showReportDialog({ eventId })
  }
  handleHashchange = () => {
    window.location.reload()
  }
  render() {
    const { children } = this.props
    const { error, errorStack } = this.state

    return error ? (
      <ErrorScreen>
        {error instanceof DAONotFound ? (
          <DAONotFoundError dao={error.dao} />
        ) : (
          <GenericError
            detailsTitle={error.message}
            detailsContent={errorStack}
            reportCallback={isSentryEnabled ? this.handleReportClick : null}
          />
        )}
      </ErrorScreen>
    ) : (
      children
    )
  }
}

export default GlobalErrorHandler
