import React from 'react'
import PropTypes from 'prop-types'
import { IconLabel, GU } from '@aragon/ui'

function LocalLabelPopoverActionLabel({ hasLabel }) {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <IconLabel
        css={`
          margin-right: ${1 * GU}px;
        `}
      />
      {hasLabel ? 'Edit' : 'Add'} custom label
    </div>
  )
}
LocalLabelPopoverActionLabel.propTypes = {
  hasLabel: PropTypes.bool,
}

export default LocalLabelPopoverActionLabel
