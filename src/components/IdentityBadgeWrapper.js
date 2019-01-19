import React from 'react'
import PropTypes from 'prop-types'
import { IdentityBadge } from '@aragon/ui'
import { network } from '../environment'

class IdentityBadgeWrapper extends React.PureComponent {
  static propTypes = {
    entity: PropTypes.string.isRequired,
    shorten: PropTypes.bool,
  }
  static defaultProps = {
    shorten: true,
  }

  render() {
    return (
      <IdentityBadge {...props} networkType={network.type}/>
    )
  }
}

export default IdentityBadgeWrapper
