import React from 'react'
import { IdentityBadge } from '@aragon/ui'
import { useWallet } from '../../wallet'

const IdentityBadgeWithNetwork = React.memo(function IdentityBadgeWithNetwork(
  props
) {
  const { networkType } = useWallet()
  return <IdentityBadge networkType={networkType} {...props} />
})

export default IdentityBadgeWithNetwork
