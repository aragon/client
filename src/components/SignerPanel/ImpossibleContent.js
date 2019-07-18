import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Info } from '@aragon/ui'
import AddressLink from './AddressLink'
import SignerButton from './SignerButton'

const ImpossibleContent = ({
  error,
  intent: { description, name, to },
  onClose,
}) => (
  <Fragment>
    <Info.Permissions title="Action impossible">
      The action {description && `“${description}”`} failed to execute
      {name && (
        <Fragment>
          on <AddressLink to={to}>{name}</AddressLink>}
        </Fragment>
      )}
      .{' '}
      {error
        ? 'An error occurred when we tried to find a path or send a transaction for this action.'
        : 'You may not have the required permissions.'}
    </Info.Permissions>
    <SignerButton onClick={onClose}>Close</SignerButton>
  </Fragment>
)

ImpossibleContent.propTypes = {
  error: PropTypes.bool,
  intent: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default ImpossibleContent
