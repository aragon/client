import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, EmptyStateCard } from '@aragon/ui'
import appNotFoundPng from './assets/app-not-found.png'

const App404 = ({ onNavigateBack }) => (
  <Main>
    <EmptyStateCard
      actionText="Go back"
      illustration={
        <img width="140" height="140" src={appNotFoundPng} alt="" />
      }
      action={<Button label="Go back" onClick={onNavigateBack} />}
      text="Oops, we couldn't find an app installed here."
    />
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
