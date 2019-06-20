import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Card, useTheme } from '@aragon/ui'

const ZoomCard = React.memo(function ZoomCard({
  addRef,
  removeRef,
  id,
  ...props
}) {
  const element = useRef(null)
  const theme = useTheme()

  useEffect(() => {
    addRef(id, element.current)
    return () => {
      removeRef(id)
    }
  }, [id])

  return (
    <Card
      ref={element}
      css={`
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 20px 30px;
      `}
      {...props}
    />
  )
})

ZoomCard.propTypes = {
  id: PropTypes.string.isRequired,
  addRef: PropTypes.func.isRequired,
  removeRef: PropTypes.func.isRequired,
}

export default ZoomCard
