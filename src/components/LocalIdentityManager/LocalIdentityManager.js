import React from 'react'
import PropTypes from 'prop-types'

const LocalIdentityContext = React.createContext({})

const LocalIdentityProvider = ({ localIdentities, children }) => {
  return (
    <LocalIdentityContext.Provider value={{ localIdentities }}>
      {children}
    </LocalIdentityContext.Provider>
  )
}

LocalIdentityProvider.propTypes = {
  localIdentities: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
}

const LocalIdentityConsumer = LocalIdentityContext.Consumer

export { LocalIdentityProvider, LocalIdentityConsumer, LocalIdentityContext }
