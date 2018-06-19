import PropTypes from 'prop-types'
import { network } from '../../environment'

const { etherscanBaseUrl } = network

// Render props component that injects an appropriate Etherscan url if possible
const EtherscanLink = ({ address, children }) =>
  children(
    typeof etherscanBaseUrl === 'string'
      ? `${etherscanBaseUrl}/address/${address}`
      : null
  )
EtherscanLink.propTypes = {
  children: PropTypes.func.isRequired,
}

export default EtherscanLink
