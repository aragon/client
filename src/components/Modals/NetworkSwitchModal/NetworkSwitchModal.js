import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'

import { GU, Modal, useTheme, useViewport, textStyle, Button } from '@aragon/ui'
import styled from 'styled-components'

NetworkSwitchModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onConnect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  account: PropTypes.string,
}

export function NetworkSwitchModal({ account, onClose, onConnect, visible }) {
  const theme = useTheme()
  const { below } = useViewport()
  const smallMode = below('medium')

  const modalWidth = useCallback(
    ({ width }) => Math.min(72 * GU, width - 4 * GU),
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
        <Body>
          <div>
            <NetworkTitle>Mainnets</NetworkTitle>
            <ButtonsRow networkNames={mainNetworks} />
          </div>
          <div>
            <NetworkTitle>Testnets</NetworkTitle>
            <ButtonsRow networkNames={testNetworks} />
          </div>
        </Body>
      </Content>
    </Modal>
  )
}

//add new networks here
const mainNetworks = ['Ethereum', 'Polygon']
const testNetworks = ['Rinkeby', 'Mumbai']

ButtonsRow.propTypes = {
  networkNames: PropTypes.arrayOf(PropTypes.string),
}

function ButtonsRow({ networkNames }) {
  return (
    <Row>
      {networkNames.map(n => (
        <FixWidthButton>{n}</FixWidthButton>
      ))}
    </Row>
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
  padding-bottom: ${2 * GU}px;
`

const Title = styled.h2`
  max-width: ${35 * GU}px;
  margin: 0 auto ${GU}px;
  ${textStyle('title2')};
`

const Subtitle = styled.p`
  ${textStyle('body2')};
  color: ${props => props.color};
`

const Body = styled.div`
  width: 100%;
  padding-top: ${2 * GU}px;
  padding-bottom: ${6 * GU}px;

  & > div:not(:first-child) {
    margin-top: ${6 * GU}px;
  }
`

const NetworkTitle = styled(Subtitle)`
  max-width: unset;
  font-weight: 700;
  text-align: center;
`

const Row = styled.div`
  padding-top: ${GU}px;
  justify-content: center;
  display: flex;

  & > :not(:first-child) {
    margin-left: ${3 * GU}px;
  }
`

const FixWidthButton = styled(Button)`
  width: ${18 * GU}px;
`
