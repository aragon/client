import React, { useReducer } from 'react'
import PropTypes from 'prop-types'

import { ModalContext } from '.'
import { initialState, modalReducer } from '../../stateManagers/modal'
import UserInfoModal from '../../components/modals'

const ModalWrapper = ({ children, ethereumAddress }) => {
  const [modal, dispatchModal] = useReducer(modalReducer, initialState)
  return (
    <ModalContext.Provider value={{ modal, dispatchModal }}>
      <UserInfoModal ethereumAddress={ethereumAddress} />
      {children}
    </ModalContext.Provider>
  )
}

ModalWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ModalWrapper
