import React from 'react'
import PropTypes from 'prop-types'

const CustomLabelModalContext = React.createContext({})

const CustomLabelModalProvider = ({ onShowCustomLabelModal, children }) => {
  return (
    <CustomLabelModalContext.Provider
      value={{ showCustomLabelModal: onShowCustomLabelModal }}
    >
      {children}
    </CustomLabelModalContext.Provider>
  )
}

CustomLabelModalProvider.propTypes = {
  onShowCustomLabelModal: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

const CustomLabelModalConsumer = CustomLabelModalContext.Consumer

export {
  CustomLabelModalProvider,
  CustomLabelModalConsumer,
  CustomLabelModalContext,
}
