import React from 'react'
import PropTypes from 'prop-types'
import getDisplayName from 'react-display-name'

export const networkContextType = PropTypes.shape({
  chainId: PropTypes.number,
  etherscanBaseUrl: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
})

const provideNetwork = Component => {
  const GetNetwork = (props, context) => <Component {...context} {...props} />
  GetNetwork.contextTypes = {
    network: networkContextType,
  }
  GetNetwork.displayName = `GetNetwork(${getDisplayName(Component)})`
  return GetNetwork
}

export default provideNetwork
