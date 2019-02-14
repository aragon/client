import React from 'react'
import PropTypes from 'prop-types'
import { SafeLink } from '@aragon/ui'
import { EthereumAddressType } from '../../prop-types'
import EtherscanLink from '../Etherscan/EtherscanLink'

const AddressLink = ({ children, to }) =>
  to ? (
    <EtherscanLink address={to}>
      {url =>
        url ? (
          <SafeLink href={url} target="_blank">
            {children || to}
          </SafeLink>
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
