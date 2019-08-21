import React from 'react'
import { isAnyEntity, isBurnEntity } from '../../permissions'
import { EthereumAddressType } from '../../prop-types'
import LocalIdentityBadge from '../../components/IdentityBadge/LocalIdentityBadge'

function PermissionsIdentityBadge({ entity, ...props }) {
  const entityLabel = isAnyEntity(entity)
    ? 'Any account'
    : isBurnEntity(entity)
    ? 'Discarded'
    : entity
  return <LocalIdentityBadge entity={entityLabel} {...props} />
}
PermissionsIdentityBadge.propTypes = {
  ...LocalIdentityBadge.propTypes,
  entity: EthereumAddressType.isRequired,
}

export default PermissionsIdentityBadge
