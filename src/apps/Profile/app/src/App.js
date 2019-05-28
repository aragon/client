import React from 'react'
import PropTypes from 'prop-types'
import { Main } from '@aragon/ui'
import styled from 'styled-components'

import { EthereumAddressType } from '../../../../prop-types'
import { BoxWrapper } from './wrappers/box'
import AppContainer from './wrappers/styleWrappers/AppContainer'
import LoadAndErrorWrapper from './wrappers/loadAndErrorWrapper'
import Profile from './components/Profile'
import { ModalWrapper } from './wrappers/modal'
import { DragWrapper } from './wrappers/drag'

const App = ({ account, onSignatures }) => (
  <Main>
    <BoxWrapper account={account} onSignatures={onSignatures}>
      <ModalWrapper ethereumAddress={account} onSignatures={onSignatures}>
        <DragWrapper>
          <AppContainer>
            <BaseLayout>
              <LoadAndErrorWrapper ethereumAddress={account}>
                <Profile
                  ethereumAddress={account}
                  onSignatures={onSignatures}
                />
              </LoadAndErrorWrapper>
            </BaseLayout>
          </AppContainer>
        </DragWrapper>
      </ModalWrapper>
    </BoxWrapper>
  </Main>
)

App.propTypes = {
  account: EthereumAddressType,
  onSignatures: PropTypes.func.isRequired,
}

const BaseLayout = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export default App
