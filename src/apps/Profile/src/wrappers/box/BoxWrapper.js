import React from 'react'
import PropTypes from 'prop-types'

import { EthereumAddressType } from '../../../../../prop-types'
import { BoxContext } from '../box'
import { use3Box, useLinkedData } from '../../hooks'

const BoxWrapper = ({ account, children, onSignatures }) => {
  const { boxes, dispatch } = use3Box(account, onSignatures)
  useLinkedData(boxes)
  return (
    <BoxContext.Provider value={{ boxes, dispatch }}>
      {children}
    </BoxContext.Provider>
  )
}

BoxWrapper.propTypes = {
  account: EthereumAddressType,
  children: PropTypes.node.isRequired,
  onSignatures: PropTypes.func.isRequired,
}

export default BoxWrapper
