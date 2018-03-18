import PropTypes from 'prop-types'
import provideNetwork from '../../context/provideNetwork'

// Render props component that injects an appropriate Etherscan url if possible
const EtherscanLink = ({ address, children, network: { etherscanBaseUrl } }) =>
  children(
    typeof etherscanBaseUrl === 'string'
      ? `${etherscanBaseUrl}/address/${address}`
      : null
  )
EtherscanLink.propTypes = {
  children: PropTypes.func.isRequired,
}

export default provideNetwork(EtherscanLink)
