import React from 'react'
import { styled, AragonApp, EmptyStateCard, IconSettings } from '@aragon/ui'

const App = () => (
  <AragonApp publicUrl="/aragon-ui/">
    <Main>
      <EmptyStateCard
        actionText="This is a demo!"
        icon={IconSettings}
        title="Demo app"
      />
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
