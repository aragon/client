import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Card, unselectable, colors } from '@aragon/ui'
import { noop } from '../../utils'

function HomeCard({ onActivate, id, title, icon }) {
  const handleClick = useCallback(() => {
    onActivate(id)
  }, [onActivate, id])

  const noDrag = useCallback(event => {
    event.preventDefault()
  }, [])

  return (
    <Main
      width="auto"
      height="100%"
      tabIndex="0"
      onClick={handleClick}
      onDragStart={noDrag}
    >
      <div>
        <img width="60" height="60" src={icon} alt="" />
        <span>{title}</span>
      </div>
    </Main>
  )
}

HomeCard.propTypes = {
  icon: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onActivate: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

HomeCard.defaultProps = {
  onActivate: noop,
}

const Main = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  text-align: center;
  ${unselectable};

  div {
    display: flex;
    flex-direction: column;
  }

  img {
    display: block;
    margin: 0 auto 15px;
  }
`

export default HomeCard
