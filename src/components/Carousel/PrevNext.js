import React from 'react'
import PropTypes from 'prop-types'
import { GU, ButtonIcon, IconRight, IconLeft } from '@aragon/ui'

function PrevNext({ onClick, type }) {
  const next = type === 'next'
  const Icon = next ? IconRight : IconLeft
  return (
    <ButtonIcon
      onClick={onClick}
      label={next ? 'Next' : 'Previous'}
      css={`
        position: absolute;
        z-index: 1;
        top: calc(50% - ${3 * GU}px);
        height: ${6 * GU}px;
        ${next ? 'right' : 'left'}: ${5 * GU}px;
      `}
    >
      <Icon size="large" />
    </ButtonIcon>
  )
}

PrevNext.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['next', 'previous']).isRequired,
}

export default PrevNext
