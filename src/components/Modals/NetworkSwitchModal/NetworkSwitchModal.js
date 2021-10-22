import React, { useCallback } from 'react'
import PropTypes from 'prop-types'

import { GU, Modal, useTheme, useViewport, textStyle, Button } from '@aragon/ui'
import styled from 'styled-components'

import { getNetworkShortName, getNetworkFullName } from '../../../util/network'
import { networkConfigs } from '../../../network-config'
import { useWallet } from '../../../contexts/wallet'

NetworkSwitchModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export function NetworkSwitchModal({ onClose, visible }) {
  const theme = useTheme()
  const { below } = useViewport()
  const smallMode = below('medium')
  const { networkType } = useWallet()
  const networkName = getNetworkFullName(networkType)

  const modalWidth = useCallback(
    ({ width }) => Math.min(72 * GU, width - 4 * GU),
    []
  )

  return (
    <Modal visible={visible} width={modalWidth} onClose={onClose}>
      <Content smallMode={smallMode}>
        <Header>
          <Title>Select a Network</Title>
          <Subtitle color={theme.contentSecondary}>
            You are currently connected to the <b>{networkName}</b> network
          </Subtitle>
        </Header>
        <Body>
          <div>
            <NetworkTitle>Mainnets</NetworkTitle>
            <ButtonsRow
              networkNames={Object.values(networkConfigs)
                .filter(chain => !chain.settings.testnet && chain.isActive)
                .map(chain => chain.settings.type)}
              onClose={onClose}
            />
          </div>
          <div>
            <NetworkTitle>Testnets</NetworkTitle>
            <ButtonsRow
              networkNames={Object.values(networkConfigs)
                .filter(chain => chain.settings.testnet && chain.isActive)
                .map(chain => chain.settings.type)}
              onClose={onClose}
            />
          </div>
        </Body>
      </Content>
    </Modal>
  )
}

ButtonsRow.propTypes = {
  networkNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
}

function ButtonsRow({ networkNames, onClose }) {
  const { changeNetworkTypeDisconnected } = useWallet()

  return (
    <Row>
      {networkNames.map(n => (
        <FixWidthButton
          key={n}
          onClick={() => {
            changeNetworkTypeDisconnected(n)
            onClose()
          }}
        >
          {getNetworkShortName(n)}
        </FixWidthButton>
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
  flex-wrap: wrap;
`

const FixWidthButton = styled(Button)`
  width: ${18 * GU}px;
  margin: ${1 * GU}px;
`
