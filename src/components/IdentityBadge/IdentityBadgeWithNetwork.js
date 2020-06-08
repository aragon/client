import React from 'react'
import { IdentityBadge } from '@aragon/ui'
import { network } from '../../environment'

const IdentityBadgeWithNetwork = React.memo(function IdentityBadgeWithNetwork(
  props
) {
  return <IdentityBadge networkType={network.type} {...props} />
})

export default IdentityBadgeWithNetwork
