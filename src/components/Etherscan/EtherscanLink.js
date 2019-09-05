import PropTypes from 'prop-types'
import { blockExplorerUrl } from '@aragon/ui'
import { network } from '../../environment'
import { EthereumAddressType } from '../../prop-types'

// Render props component that injects an appropriate Etherscan url if possible
const EtherscanLink = ({ address, children }) => {
  const etherscanUrl = blockExplorerUrl('address', address, {
    networkType: network.type,
  })
  return children(etherscanUrl)
}
EtherscanLink.propTypes = {
  address: EthereumAddressType,
  children: PropTypes.func.isRequired,
}

export default EtherscanLink
