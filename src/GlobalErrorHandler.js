import React from 'react'
import { BaseStyles, PublicUrl } from '@aragon/ui'
import GenericError from './components/Error/GenericError'
import DAONotFoundError from './components/Error/DAONotFoundError'
import { DAONotFound } from './errors'

class GlobalErrorHandler extends React.Component {
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
          `}
        >
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
              />
            )}
          </div>
        </div>
      </PublicUrl.Provider>
    )
  }
}

export default GlobalErrorHandler
