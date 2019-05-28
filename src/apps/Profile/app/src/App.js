import React from 'react'
import { Main } from '@aragon/ui'
import styled from 'styled-components'

import { BoxWrapper } from './wrappers/box'
import AppContainer from './wrappers/styleWrappers/AppContainer'
import LoadAndErrorWrapper from './wrappers/loadAndErrorWrapper'
import Profile from './components/Profile'
import { ModalWrapper } from './wrappers/modal'
import { DragWrapper } from './wrappers/drag'

function App() {
  return (
    <Main>
      <BoxWrapper>
        <ModalWrapper ethereumAddress={''}>
          <DragWrapper>
            <AppContainer>
              <BaseLayout>
                <LoadAndErrorWrapper ethereumAddress={''}>
                  <Profile ethereumAddress={''} />
                </LoadAndErrorWrapper>
              </BaseLayout>
            </AppContainer>
          </DragWrapper>
        </ModalWrapper>
      </BoxWrapper>
    </Main>
  )
}

const BaseLayout = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export default App
