import React, { useReducer } from 'react'
import PropTypes from 'prop-types'

import { ModalContext } from '.'
import { initialState, modalReducer } from '../../stateManagers/modal'
import UserInfoModal from '../../components/modals'

const ModalWrapper = ({ children, ethereumAddress, onSignatures }) => {
  const [modal, dispatchModal] = useReducer(modalReducer, initialState)
  return (
    <ModalContext.Provider value={{ modal, dispatchModal }}>
      <UserInfoModal
        ethereumAddress={ethereumAddress}
        onSignatures={onSignatures}
      />
      {children}
    </ModalContext.Provider>
  )
}

ModalWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  ethereumAddress: PropTypes.string.isRequired,
  onSignatures: PropTypes.func.isRequired,
}

export default ModalWrapper
