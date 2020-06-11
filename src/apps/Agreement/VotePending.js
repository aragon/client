import React from 'react'
import { Timer, Link, GU, useLayout } from '@aragon/ui'
import PropTypes from 'prop-types'

function VotePending({ endDate }) {
  const { layoutName } = useLayout()

  return (
    <div
      css={`
        padding: ${layoutName === 'small' ? 2 * GU : 3 * GU}px;
      `}
    >
      <h2
        css={`
          line-height: 1.2;
        `}
      >
        Agreement creation pending
      </h2>
      <Link
        href=""
        css={`
          line-height: 1;
          margin-bottom: ${GU * 2}px;
        `}
      >
        <span>View vote</span>
      </Link>
      <Timer end={endDate} />
    </div>
  )
}

VotePending.propTypes = {
  endDate: PropTypes.instanceOf(Date),
}

export default VotePending
