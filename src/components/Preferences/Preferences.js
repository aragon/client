import React, { useCallback, useEffect, useState } from 'react'
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
  breakpoint,
  font,
  springs,
  useViewport,
} from '@aragon/ui'
import { AragonType } from '../../prop-types'
import { useEsc, useSharedLabels } from '../../hooks'
import SharedLabels from './SharedLabels'
import LocalIdentities from './LocalIdentities'

const TABS = ['Manage labels']

// checks if data is present via shared link
// if so, displays shared labels which can be selected and saved
// if not, displays regular selectable -> shareable -> local identities
const Preferences = React.memo(({ dao, onClose, opened, wrapper }) => {
  const { below } = useViewport()
  const smallView = below('medium')
  const {
    isSharedLink,
    setIsSharedLink,
    sharedLabels,
    removeSharedLink,
  } = useSharedLabels(dao)
  const [preferencesOpened, setPreferencesOpened] = useState(opened)
  const [selectedTab, setSelectedTab] = useState(0)

  const handleClose = useCallback(() => {
    if (isSharedLink) {
      removeSharedLink()
    }
    setIsSharedLink(false)
    setPreferencesOpened(false)
    onClose()
  }, [isSharedLink, onClose, setIsSharedLink, removeSharedLink])
  const handleSave = useCallback(() => {
    removeSharedLink()
    setPreferencesOpened(true)
    setIsSharedLink(false)
  }, [removeSharedLink, setIsSharedLink])

  useEsc(handleClose)
  useEffect(() => setPreferencesOpened(opened), [opened])

  return (
    <Transition
      native
      items={preferencesOpened || isSharedLink}
      from={{ opacity: 0, enterProgress: 0, blocking: false }}
      enter={{ opacity: 1, enterProgress: 1, blocking: true }}
      leave={{ opacity: 0, enterProgress: 1, blocking: false }}
      config={springs.smooth}
    >
      {show =>
        show &&
        /* eslint-disable react/prop-types */
        // z-index 2 on mobile keeps the menu above this preferences modal
        (({ opacity, enterProgress, blocking }) => (
          <AnimatedWrap
            style={{
              zIndex: smallView ? 2 : 5,
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
            <AppView
              smallView={smallView}
              padding={0}
              appBar={
                <StyledAppBar>
                  <Title>
                    {isSharedLink
                      ? 'Save custom labels'
                      : preferencesOpened
                      ? 'Preferences'
                      : ''}
                  </Title>
                  <CloseButton onClick={handleClose} />
                </StyledAppBar>
              }
            >
              <Section>
                {!isSharedLink && (
                  <TabBar
                    items={TABS}
                    selected={selectedTab}
                    onChange={setSelectedTab}
                  />
                )}
                {isSharedLink ? (
                  <SharedLabels
                    labels={sharedLabels}
                    onClose={handleClose}
                    onSave={handleSave}
                    wrapper={wrapper}
                  />
                ) : preferencesOpened ? (
                  <LocalIdentities dao={dao} wrapper={wrapper} />
                ) : null}
              </Section>
            </AppView>
          </AnimatedWrap>
        ))
      /* eslint-enable react/prop-types */
      }
    </Transition>
  )
})

Preferences.propTypes = {
  dao: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  opened: PropTypes.bool,
  wrapper: AragonType,
}

Preferences.defaultProps = {
  opened: false,
}

const AnimatedWrap = styled(animated.div)`
  position: fixed;
  background: #fff;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  min-width: 320px;
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

const CloseButton = styled(ButtonIcon).attrs({
  children: <IconClose />,
  label: 'Close',
})`
  width: auto;
  height: 100%;
  padding: 0 16px;

  ${breakpoint(
    'medium',
    `
      /* half screen width minus half max container width */
      margin-right: calc(100vw / 2 - ${BREAKPOINTS.medium / 2}px);
    `
  )}
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

export default Preferences
