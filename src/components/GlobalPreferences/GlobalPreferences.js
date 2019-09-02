import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  ButtonIcon,
  GU,
  Header,
  IconClose,
  Layout,
  Tabs,
  breakpoint,
  springs,
  useTheme,
  useToast,
  useViewport,
} from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import { AragonType } from '../../prop-types'
import { useEsc } from '../../hooks'
import Network from './Network/Network'
import Notifications from './Notifications/Notifications'
import CustomLabels from './CustomLabels/CustomLabels'
import HelpAndFeedback from './HelpAndFeedback/HelpAndFeedback'
import SharedIdentities from './SharedIdentities/SharedIdentities'
import useSharedLink from './SharedIdentities/useSharedLink'

const SECTIONS = new Map([
  ['custom-labels', 'Custom Labels'],
  ['network', 'Network'],
  ['notifications', 'Notifications'],
  ['help-and-feedback', 'Help and feedback'],
])
const PATHS = Array.from(SECTIONS.keys())
const VALUES = Array.from(SECTIONS.values())

function GlobalPreferences({
  compact,
  locator,
  onClose,
  onNavigation,
  onScreenChange,
  sectionIndex,
  wrapper,
}) {
  const toast = useToast()
  const { dao } = locator

  const {
    isSharedLink,
    isSavingSharedLink,
    sharedIdentities,
    handleSharedIdentitiesSave,
    handleSharedIdentitiesCancel,
    handleSharedIdentitiesToggleAll,
    handleSharedIdentitiesToggleIdentity,
    sharedIdentitiesSelected,
    sharedIdentitiesAllSelected,
    sharedIdentitiesSomeSelected,
  } = useSharedLink({ wrapper, toast, locator, onScreenChange })

  const handleSharedIdentitiesClose = () => {
    handleSharedIdentitiesCancel()
    onClose()
  }

  useEsc(onClose)

  return (
    <Layout>
      <Close
        compact={compact}
        onClick={isSharedLink ? handleSharedIdentitiesClose : onClose}
      />
      <Header
        primary={isSharedLink ? 'Save Custom Labels' : 'Global preferences'}
        css={`
          padding-top: ${!compact ? 10 * GU : 0}px;
        `}
      />
      {isSharedLink ? (
        <SharedIdentities
          isSaving={isSavingSharedLink}
          onSave={handleSharedIdentitiesSave}
          onCancel={handleSharedIdentitiesCancel}
          identities={sharedIdentities}
          onToggleAll={handleSharedIdentitiesToggleAll}
          onToggleIdentity={handleSharedIdentitiesToggleIdentity}
          selected={sharedIdentitiesSelected}
          allSelected={sharedIdentitiesAllSelected}
          someSelected={sharedIdentitiesSomeSelected}
        />
      ) : (
        <React.Fragment>
          <Tabs
            items={VALUES}
            onChange={onNavigation}
            selected={sectionIndex}
          />
          <main>
            {sectionIndex === 0 && (
              <CustomLabels dao={dao} wrapper={wrapper} locator={locator} />
            )}
            {sectionIndex === 1 && <Network wrapper={wrapper} />}
            {sectionIndex === 2 && <Notifications />}
            {sectionIndex === 3 && <HelpAndFeedback />}
          </main>
        </React.Fragment>
      )}
    </Layout>
  )
}

GlobalPreferences.propTypes = {
  compact: PropTypes.bool,
  locator: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onNavigation: PropTypes.func.isRequired,
  onScreenChange: PropTypes.func.isRequired,
  sectionIndex: PropTypes.number,
  wrapper: AragonType,
}

function useGlobalPreferences({ locator = {}, onScreenChange }) {
  const [sectionIndex, setSectionIndex] = useState(null)

  const handleNavigation = useCallback(
    index => {
      onScreenChange(PATHS[index])
    },
    [onScreenChange]
  )

  useEffect(() => {
    const { preferences: { path = '' } = {} } = locator
    if (!path || !SECTIONS.has(path)) {
      setSectionIndex(null)
      return
    }
    setSectionIndex(PATHS.findIndex(item => item === path))
  }, [locator])

  return { sectionIndex, handleNavigation }
}

function Close({ compact, onClick }) {
  const theme = useTheme()
  return (
    <div
      css={`
        position: absolute;
        right: 0;
        padding-top: ${2.5 * GU}px;
        padding-right: ${3 * GU}px;

        ${compact &&
          `
            padding-top: ${2 * GU}px;
            padding-right: ${1.5 * GU}px;
          `}
      `}
    >
      <ButtonIcon onClick={onClick} label="Close">
        <IconClose
          css={`
            color: ${theme.surfaceIcon};
          `}
        />
      </ButtonIcon>
    </div>
  )
}

Close.propTypes = {
  compact: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

function AnimatedGlobalPreferences(props) {
  const { sectionIndex, handleNavigation } = useGlobalPreferences({
    locator: props.locator,
    onScreenChange: props.onScreenChange,
  })

  const { below } = useViewport()
  const compact = below('medium')
  const theme = useTheme()

  return (
    <Transition
      native
      items={sectionIndex !== null}
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
            accent={theme.accent}
            surface={theme.surface}
            style={{
              zIndex: compact ? 2 : 5,
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
            <GlobalPreferences
              {...props}
              compact={compact}
              sectionIndex={sectionIndex}
              onNavigation={handleNavigation}
            />
          </AnimatedWrap>
        ))
      /* eslint-enable react/prop-types */
      }
    </Transition>
  )
}

AnimatedGlobalPreferences.propTypes = {
  locator: PropTypes.object,
  onScreenChange: PropTypes.func.isRequired,
}

const AnimatedWrap = styled(animated.div)`
  position: fixed;
  background: #fff;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  min-width: 360px;
  border-top: ${({ accent }) => `2px solid ${accent}`};
  background: ${({ surface }) => surface};
  overflow: auto;
  padding-bottom: ${2 * GU}px;

  ${breakpoint('medium', `padding-bottom:0;`)}
`

export default React.memo(AnimatedGlobalPreferences)
