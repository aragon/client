import React from 'react'
import PropTypes from 'prop-types'

const LocalIdentityModalContext = React.createContext({})

const LocalIdentityModalProvider = ({ onShowLocalIdentityModal, children }) => {
  return (
    <LocalIdentityModalContext.Provider
      value={{ showLocalIdentityModal: onShowLocalIdentityModal }}
    >
      {children}
    </LocalIdentityModalContext.Provider>
  )
}

LocalIdentityModalProvider.propTypes = {
  onShowLocalIdentityModal: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

const LocalIdentityModalConsumer = LocalIdentityModalContext.Consumer

export {
  LocalIdentityModalProvider,
  LocalIdentityModalConsumer,
  LocalIdentityModalContext,
}
