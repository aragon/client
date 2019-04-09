import React from 'react'
import { IdentityBadge } from '@aragon/ui'
import { network } from '../../environment'

class IdentityBadgeWithNetwork extends React.PureComponent {
  render() {
    const { ...props } = this.props
    return <IdentityBadge networkType={network.type} {...props} />
  }
}

export default IdentityBadgeWithNetwork
