import React from 'react'
import PropTypes from 'prop-types'
import { Button, GU, IconConnect, useViewport } from '@aragon/ui'

const ButtonConnect = React.forwardRef(function ButtonConnect(
  { onClick },
  ref
) {
  const { below } = useViewport()

  return (
    <Button
      innerRef={ref}
      display={below('medium') ? 'icon' : 'all'}
      icon={<IconConnect />}
      label="Connect account"
      onClick={onClick}
      css={`
        min-width: ${5 * GU}px;
        margin: 0 ${2 * GU}px;
      `}
    />
  )
})

ButtonConnect.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ButtonConnect
