import React from 'react'
import PropTypes from 'prop-types'
import { Link } from '@aragon/ui'
import { EthereumAddressType } from '../../prop-types'
import EtherscanLink from '../Etherscan/EtherscanLink'

const AddressLink = ({ children, to }) =>
  to ? (
    <EtherscanLink address={to}>
      {url =>
        url ? (
          <Link href={url} focusRingSpacing={[3, 2]}>
            {children || to}
          </Link>
        ) : (
          to
        )
      }
    </EtherscanLink>
  ) : (
    'an address or app'
  )
AddressLink.propTypes = {
  children: PropTypes.node,
  to: EthereumAddressType,
}

export default AddressLink
