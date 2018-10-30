import React from 'react'
import { SafeLink } from '@aragon/ui'
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

export default AddressLink
