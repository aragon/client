import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import GenericError from './components/Error/GenericError'
import DAONotFoundError from './components/Error/DAONotFoundError'
import { DAONotFound } from './errors'

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
  handleHashchange = () => {
    window.location.reload()
  }
  render() {
    const { error, errorStack } = this.state
    if (!error) {
      return this.props.children
    }
    return (
      <Main>
        <In>
          {error instanceof DAONotFound ? (
            <DAONotFoundError dao={error.dao} />
          ) : (
            <GenericError
              detailsTitle={error.message}
              detailsContent={errorStack}
            />
          )}
        </In>
      </Main>
    )
  }
}

const Main = styled.div`
  height: 100vh;
  overflow: auto;
`

const In = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -30px;
  padding: 50px 20px 20px;
  min-height: 100%;
`

export default GlobalErrorHandler
