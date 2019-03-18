import React from 'react'
import PropTypes from 'prop-types'

const IdentityContext = React.createContext({
  resolve: () =>
    Promise.reject(Error('Please set resolve using IdentityProvider')),
})

const IdentityProvider = ({ onResolve, children }) => {
  return (
    <IdentityContext.Provider value={{ resolve: onResolve }}>
      {children}
    </IdentityContext.Provider>
  )
}

IdentityProvider.propTypes = {
  onResolve: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

const IdentityConsumer = IdentityContext.Consumer

export { IdentityProvider, IdentityConsumer, IdentityContext }
