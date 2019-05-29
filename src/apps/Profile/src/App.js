import React from 'react'
import PropTypes from 'prop-types'
import { Main } from '@aragon/ui'
import styled from 'styled-components'

import { EthereumAddressType } from '../../../prop-types'
import { BoxWrapper } from './wrappers/box'
import AppContainer from './wrappers/styleWrappers/AppContainer'
import LoadAndErrorWrapper from './wrappers/loadAndErrorWrapper'
import Profile from './components/Profile'
import { ModalWrapper } from './wrappers/modal'
import { DragWrapper } from './wrappers/drag'
import { determineAddress, isViewMode } from './utils'

const App = ({ account, onSignatures, parts }) => (
  <Main>
    <BoxWrapper
      isViewMode={isViewMode(account, parts)}
      account={determineAddress(account, parts)}
      onSignatures={onSignatures}
    >
      <ModalWrapper
        ethereumAddress={determineAddress(account, parts)}
        onSignatures={onSignatures}
      >
        <DragWrapper>
          <AppContainer>
            <BaseLayout>
              <LoadAndErrorWrapper
                ethereumAddress={determineAddress(account, parts)}
              >
                <Profile
                  ethereumAddress={determineAddress(account, parts)}
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
  parts: PropTypes.array,
}

App.defaultProps = { parts: [] }

const BaseLayout = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

export default App
