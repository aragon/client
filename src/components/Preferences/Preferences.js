import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Transition, animated } from 'react-spring'
import {
  AppBar,
  AppView,
  BREAKPOINTS,
  ButtonIcon,
  IconClose,
  TabBar,
  Viewport,
  breakpoint,
  font,
  springs,
} from '@aragon/ui'
import keycodes from '../../keycodes'
import { AragonType } from '../../prop-types'
import {
  IdentityContext,
  identityEventTypes,
} from '../IdentityManager/IdentityManager'
import LocalIdentitiesComponent from './LocalIdentities'

const TABS = ['Manage labels']

const Preferences = ({ dao, onClose, smallView, wrapper }) => {
  const { identityEvents$ } = React.useContext(IdentityContext)
  const [selectedTab, setSelectedTab] = React.useState(0)
  const [localIdentities, setLocalIdentities] = React.useState({})
  const handleGetAll = async () => {
    if (!wrapper) {
      return
    }
    setLocalIdentities(await wrapper.getLocalIdentities())
  }
  const handleClearAll = async () => {
    if (!wrapper) {
      return
    }
    await wrapper.clearLocalIdentities()
    setLocalIdentities({})
    identityEvents$.next({ type: identityEventTypes.CLEAR })
  }
  const handleModify = (address, data) => {
    if (!wrapper) {
      return
    }
    wrapper.modifyAddressIdentity(address, data)
  }
  const handleImport = async list => {
    if (!wrapper) {
      return
    }
    setLocalIdentities({})
    for (const { name, address } of list) {
      await wrapper.modifyAddressIdentity(address, { name })
    }
    setLocalIdentities(await wrapper.getLocalIdentities())
    identityEvents$.next({ type: identityEventTypes.IMPORT })
  }
  const handlekeyDown = e => {
    if (e.keyCode === keycodes.esc) {
      onClose()
    }
  }
  React.useEffect(() => {
    handleGetAll()
    window.addEventListener('keydown', handlekeyDown)
    return () => window.removeEventListener('keydown', handlekeyDown)
  }, [])

  return (
    <AppView
      smallView={smallView}
      padding={0}
      appBar={
        <StyledAppBar>
          <Title>Preferences</Title>
          <StyledButton label="Close" onClick={onClose}>
            <IconClose />
          </StyledButton>
        </StyledAppBar>
      }
    >
      <Section>
        <TabBar items={TABS} selected={selectedTab} onChange={setSelectedTab} />
        <Content>
          {selectedTab === 0 && (
            <LocalIdentitiesComponent
              dao={dao}
              localIdentities={localIdentities}
              onImport={handleImport}
              onClearAll={handleClearAll}
              onModify={handleModify}
              onModifyEvent={handleGetAll}
            />
          )}
        </Content>
      </Section>
    </AppView>
  )
}

Preferences.propTypes = {
  dao: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  smallView: PropTypes.bool.isRequired,
  wrapper: AragonType,
}

const AnimatedPreferences = ({ opened, ...props }) => {
  return (
    <Transition
      native
      items={opened}
      from={{ opacity: 0, enterProgress: 0, blocking: false }}
      enter={{ opacity: 1, enterProgress: 1, blocking: true }}
      leave={{ opacity: 0, enterProgress: 1, blocking: false }}
      config={springs.smooth}
    >
      {show =>
        show &&
        /* eslint-disable react/prop-types */
        (({ opacity, enterProgress, blocking }) => (
          <AnimatedWrap
            style={{
              pointerEvents: blocking ? 'auto' : 'none',
              opacity,
              transform: enterProgress.interpolate(
                v => `
                  translate3d(0, ${(1 - v) * 10}px, 0)
                  scale3d(${1 - (1 - v) * 0.03}, ${1 - (1 - v) * 0.03}, 1)
                `
              ),
            }}
          >
            <Preferences {...props} />
          </AnimatedWrap>
        ))
      /* eslint-enable react/prop-types */
      }
    </Transition>
  )
}

AnimatedPreferences.propTypes = {
  opened: PropTypes.bool,
  smallView: PropTypes.bool.isRequired,
}

const AnimatedWrap = styled(animated.div)`
  position: fixed;
  background: #fff;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${({ smallView }) => (smallView ? 2 : 4)};
  min-width: 320px;
`

const Title = styled.h1`
  ${font({ size: 'xxlarge' })};

  ${breakpoint(
    'medium',
    `
      /* half screen width minus half max container width */
      margin-left: calc(100vw / 2 - ${BREAKPOINTS.medium / 2}px);
    `
  )}
`

const Section = styled.section`
  padding: 16px 0;

  ${breakpoint(
    'medium',
    `
      width: ${BREAKPOINTS.medium}px;
      margin: 0 auto;
    `
  )}
`

const Content = styled.main`
  padding-top: 16px;
`

const StyledAppBar = styled(AppBar)`
  padding-left: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${breakpoint(
    'medium',
    `
      padding-left: 0;
    `
  )}
`

const StyledButton = styled(ButtonIcon)`
  width: auto;
  height: 100%;
  padding: 0 16px;
`

export default props => (
  <Viewport>
    {({ below }) => (
      <AnimatedPreferences smallView={below('medium')} {...props} />
    )}
  </Viewport>
)
