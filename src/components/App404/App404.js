import React from 'react'
import { styled } from '@aragon/ui'
import EmptyAppCard from './EmptyAppCard'

const App404 = ({ appId }) => (
  <Main>
    <EmptyAppCard appId={appId} />
  </Main>
)

const Main = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
`

export default App404
