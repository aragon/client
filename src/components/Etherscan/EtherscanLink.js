import PropTypes from 'prop-types'
import { network } from '../../environment'
import { blockExplorerUrl } from '@aragon/ui'

// Render props component that injects an appropriate Etherscan url if possible
const EtherscanLink = ({ address, children }) => {
  const etherscanUrl = blockExplorerUrl('address', address, { networkType: network.type })
  return children(typeof etherscanUrl === 'string' ? etherscanUrl : null)
}
EtherscanLink.propTypes = {
  children: PropTypes.func.isRequired,
}

export default EtherscanLink
