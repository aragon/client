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
import CustomLabels from './CustomLabels'

const TABS = ['Network', 'Manage labels']

const Preferences = ({ onClose, localIdentities, smallView, wrapper }) => {
  const [selectedTab, setSelectedTab] = React.useState(1)

  return (
    <AppView
      smallView={smallView}
      padding={0}
      appBar={
        <StyledAppBar>
          <Title>My Preferences</Title>
          <StyledButton label="Close" onClick={onClose}>
            <IconClose />
          </StyledButton>
        </StyledAppBar>
      }
    >
      <Section>
        <TabBar items={TABS} selected={selectedTab} onChange={setSelectedTab} />
        <Content>
          {selectedTab === 0 && <ComingSoon />}
          {selectedTab === 1 && (
            <CustomLabels wrapper={wrapper} localIdentities={localIdentities} />
          )}
        </Content>
      </Section>
    </AppView>
  )
}

Preferences.propTypes = {
  onClose: PropTypes.func.isRequired,
  smallView: PropTypes.bool.isRequired,
  wrapper: PropTypes.object.isRequired,
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

const ComingSoon = () => <div css="padding: 0 16px">Coming soon…</div>

const Title = styled.h1`
  ${font({ size: 'xxlarge' })};

  ${breakpoint(
    'medium',
    `
      /* half screen width minus half max container witdh */
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
