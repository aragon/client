import React from 'react'
import { Field } from '@aragon/ui'
import PropTypes from 'prop-types'

function InfoField({ label, children, ...props }) {
  return (
    <Field
      label={label}
      {...props}
      css={`
        margin-bottom: 0;
      `}
    >
      {/* Pass unused id to disable clickable label  */}
      {({ id }) => <React.Fragment>{children}</React.Fragment>}
    </Field>
  )
}

InfoField.propTypes = {
  label: PropTypes.node,
  children: PropTypes.node,
}

export default InfoField
