import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ButtonBase, GU } from '@aragon/ui'
import { useLocalIdentity } from '../../hooks'

export const MENU_PANEL_APP_INSTANCE_HEIGHT = 4 * GU

const MenuPanelAppInstance = React.memo(function MenuPanelAppInstance({
  active,
  id,
  name,
  onClick,
}) {
  const [label, setLabel] = useState(name)
  const handleClick = () => {
    onClick(id)
  }
  const { name: localIdentity } = useLocalIdentity(id)
  useEffect(() => {
    setLabel(localIdentity || name)
  }, [localIdentity, name])

  return (
    <ButtonBase
      onClick={handleClick}
      css={`
        display: flex;
        align-items: center;
        height: ${MENU_PANEL_APP_INSTANCE_HEIGHT}px;
        width: 100%;
        cursor: pointer;
        ${active ? 'font-weight: 600' : ''}
      `}
    >
      <span
        css={`
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        `}
      >
        {label}
      </span>
    </ButtonBase>
  )
})
MenuPanelAppInstance.propTypes = {
  active: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default MenuPanelAppInstance
