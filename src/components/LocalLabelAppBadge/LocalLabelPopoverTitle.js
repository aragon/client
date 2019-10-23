import React from 'react'
import PropTypes from 'prop-types'
import { Tag, GU } from '@aragon/ui'

function LocalLabelPopoverTitle({ label }) {
  return (
    <div
      css={`
        display: grid;
        align-items: center;
        grid-template-columns: auto 1fr;
      `}
    >
      <span
        css={`
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        `}
      >
        {label}
      </span>
      <Tag
        mode="identifier"
        css={`
          margin-left: ${2 * GU}px;
        `}
      >
        Custom label
      </Tag>
    </div>
  )
}
LocalLabelPopoverTitle.propTypes = {
  label: PropTypes.string.isRequired,
}

export default LocalLabelPopoverTitle
