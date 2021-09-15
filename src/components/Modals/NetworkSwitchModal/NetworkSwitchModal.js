import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { GU, Modal, textStyle, useTheme, useViewport } from '@aragon/ui'
import styled from 'styled-components'

NetworkSwitchModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onConnect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  account: PropTypes.string,
}

function NetworkSwitchModal({ account, onClose, onConnect, visible }) {
  const theme = useTheme()
  const { below } = useViewport()
  const smallMode = below('medium')

  const modalWidth = useCallback(
    ({ width }) => Math.min(55 * GU, width - 4 * GU),
    []
  )

  useEffect(() => {
    if (account) {
      onConnect()
    }
  }, [account, onConnect])

  return (
    <Modal visible={visible} width={modalWidth} onClose={onClose}>
      <Content smallMode={smallMode}>
        <Header>
          <Title>Select a Network</Title>
          <Subtitle color={theme.contentSecondary}>
            You are currently connected to the <b>Rinkeby</b> network
          </Subtitle>
        </Header>
      </Content>
    </Modal>
  )
}

const Content = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${props => (props.smallMode ? 0 : 3 * GU)}px;
  padding-top: ${props => (props.smallMode ? 5 * GU : 3 * GU)}px;
  padding-bottom: ${props => (props.smallMode ? 0 : 2 * GU)}px;
`

const Header = styled.header`
  text-align: center;
`

const Title = styled.h1`
  max-width: ${35 * GU}px;
  margin: 0 auto ${1 * GU}px;
  ${textStyle('title1')};
  font-weight: 600;
`
const Subtitle = styled.p`
  max-width: ${35 * GU}px;
  ${textStyle('body1')};
  color: ${props => props.color};
`
export default NetworkSwitchModal
