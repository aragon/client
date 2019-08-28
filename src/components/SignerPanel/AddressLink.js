import React from 'react'
import PropTypes from 'prop-types'
import { ButtonText } from '@aragon/ui'
import { EthereumAddressType } from '../../prop-types'
import EtherscanLink from '../Etherscan/EtherscanLink'

const AddressLink = ({ children, to }) =>
  to ? (
    <EtherscanLink address={to}>
      {url =>
        url ? (
          <ButtonText
            href={url}
            target="_blank"
            horizontalPadding="none"
            css="padding: 0"
          >
            {children || to}
          </ButtonText>
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
