import React from 'react'
import styled from 'styled-components'
import { AragonApp, EmptyStateCard } from '@aragon/ui'

import icon from './assets/icon-demo.svg'

const Icon = <img src={icon} alt="" />

const App = () => (
  <AragonApp publicUrl="/aragon-ui/">
    <Main>
      <EmptyStateCard actionText="Button" icon={() => Icon} title="Demo App" />
    </Main>
  </AragonApp>
)

const Main = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
`

export default App
