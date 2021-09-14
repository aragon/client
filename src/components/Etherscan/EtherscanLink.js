import PropTypes from 'prop-types'
import { blockExplorerUrl } from '@aragon/ui'
import { EthereumAddressType } from '../../prop-types'
import { useWallet } from '../../contexts/wallet'

// Render props component that injects an appropriate Etherscan url if possible
const EtherscanLink = ({ address, children }) => {
  const { networkType } = useWallet()
  const etherscanUrl = blockExplorerUrl('address', address, {
    networkType,
  })
  return children(etherscanUrl)
}
EtherscanLink.propTypes = {
  address: EthereumAddressType,
  children: PropTypes.func.isRequired,
}

export default EtherscanLink
