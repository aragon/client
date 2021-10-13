import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Button, GU, IconSettings, useTheme } from '@aragon/ui'
import AccountModule from '../../components/AccountModule/AccountModule'
import HomeButton from '../../components/HomeButton/HomeButton'
import { useWallet } from '../../contexts/wallet'
import { isOnEthMainnet } from '../../util/network'
import styled from 'styled-components'
import { NetworkIndicator } from '../../components/NetworkIndicator/NetworkIndicator'
import { trackEvent, events } from '../../analytics'

function OnboardingTopBar({ status, solid, modalOpener }) {
  const theme = useTheme()
  const { networkType } = useWallet()
  const isMainnet = isOnEthMainnet(networkType)

  const handleSettingsClick = useCallback(() => {
    let path = '/'
    if (status === 'open') {
      path = '/open'
    }
    if (status === 'create') {
      path = '/create'
    }
    window.location.hash = path + '?preferences=/network'

    // analytics
    trackEvent(events.USER_SETTINGS_CLICKED, {
      network: networkType,
    })
  }, [status, networkType])

  return (
    <React.Fragment>
      <TopBarDiv surface={theme.surface.alpha(solid ? 0.8 : 0)}>
        <BlueLine color={theme.accent} />
        <HomeButton />
        <ButtonContainer>
          <NetworkIndicator clickHandler={modalOpener} />
          <AccountModule />
          {isMainnet && (
            <Button
              display="icon"
              icon={<IconSettings />}
              label="Settings"
              size="medium"
              onClick={handleSettingsClick}
            />
          )}
        </ButtonContainer>
      </TopBarDiv>
    </React.Fragment>
  )
}

const BlueLine = styled.div`
  position: absolute;
  top: 0;
  z-index: 1;
  width: 100%;
  border-top: 2px solid ${props => props.color};
`

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: ${2 * GU}px;
  height: 100%;
`

const TopBarDiv = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  height: ${7.5 * GU}px;
  background: ${props => props.surfaceColor};
  transition: background 150ms ease-in-out;
  backdrop-filter: blur(6px);
`

OnboardingTopBar.propTypes = {
  status: PropTypes.string.isRequired,
  solid: PropTypes.bool,
  modalOpener: PropTypes.func.isRequired,
}

export default OnboardingTopBar
