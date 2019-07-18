import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useLocalIdentity } from '../../hooks'

function MenuPanelInstance({ active, id, name, onClick }) {
  const [label, setLabel] = useState(name)
  const handleClick = () => {
    onClick(id)
  }
  const { name: localIdentity } = useLocalIdentity(id)
  useEffect(() => {
    setLabel(localIdentity || name)
  }, [localIdentity, name])

  return (
    <Main role="button" tabIndex="0" active={active} onClick={handleClick}>
      <Label>{label}</Label>
    </Main>
  )
}

MenuPanelInstance.propTypes = {
  active: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

const Main = styled.a`
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  padding-left: calc(22px + 15px);
  line-height: 30px;
  font-weight: ${({ active }) => (active ? '800' : '400')};
  font-size: 13px;
  cursor: pointer;
`

const Label = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export default React.memo(MenuPanelInstance)
