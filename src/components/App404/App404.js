import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import EmptyAppCard from './EmptyAppCard'

const App404 = ({ onNavigateBack }) => (
  <Main>
    <EmptyAppCard onActivate={onNavigateBack} />
  </Main>
)

App404.propTypes = {
  onNavigateBack: PropTypes.func.isRequired,
}

const Main = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
`

export default App404
