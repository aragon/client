import React from 'react'
import PropTypes from 'prop-types'
import { Info } from '@aragon/ui'
import AddressLink from './AddressLink'
import SignerButton from './SignerButton'

const ImpossibleAction = ({
  error,
  intent: { description, name, to },
  onClose,
}) => (
  <React.Fragment>
    <Info mode="warning" title="Action impossible">
      The action {description && `“${description}”`} failed to execute
      {name && (
        <React.Fragment>
          {' '}
          on <AddressLink to={to}>{name}</AddressLink>
        </React.Fragment>
      )}
      .{' '}
      {error
        ? 'An error occurred when we tried to find a path or send a transaction for this action.'
        : 'You may not have the required permissions.'}
    </Info>
    <SignerButton onClick={onClose}>Close</SignerButton>
  </React.Fragment>
)

ImpossibleAction.propTypes = {
  error: PropTypes.bool,
  intent: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default ImpossibleAction
