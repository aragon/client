import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  ButtonIcon,
  GU,
  IconClose,
  Layout,
  Header,
  Tabs,
  Toast,
  springs,
  breakpoint,
  useTheme,
  useViewport,
} from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import { AragonType, AppType } from '../../prop-types'
import { useEsc } from '../../hooks'
import Network from './Network/Network'
import Notifications from './Notifications/Notifications'
import CustomLabels from './CustomLabels/CustomLabels'
import HelpAndFeedback from './HelpAndFeedback/HelpAndFeedback'
import SharedIdentities from './SharedIdentities/SharedIdentities'
import useSharedLink from './SharedIdentities/useSharedLink'
import { GLOBAL_PREFERENCES_QUERY_PARAM, getAppPath } from '../../routing'

const SECTIONS = new Map([
  ['custom-labels', 'Custom Labels'],
  ['network', 'Network'],
  ['notifications', 'Notifications'],
  ['help-and-feedback', 'Help and feedback'],
])
const PATHS = Array.from(SECTIONS.keys())
const VALUES = Array.from(SECTIONS.values())
const TIMEOUT_TOAST = 4000
const CUSTOM_LABELS_INDEX = 0
const NETWORK_INDEX = 1
const NOTIFICATIONS_INDEX = 2
const HELP_AND_FEEDBACK_INDEX = 3

function GlobalPreferences({
  apps,
  compact,
  onClose,
  toast,
  wrapper,
  locator,
  sectionIndex,
  subsection,
  onNavigation,
}) {
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
  } = useSharedLink({ wrapper, toast, locator })
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
            {sectionIndex === CUSTOM_LABELS_INDEX && (
              <CustomLabels dao={dao} wrapper={wrapper} locator={locator} />
            )}
            {sectionIndex === NETWORK_INDEX && <Network wrapper={wrapper} />}
            {sectionIndex === NOTIFICATIONS_INDEX && (
              <Notifications
                apps={apps}
                dao={dao}
                subsection={subsection}
                handleNavigation={onNavigation}
                navigationIndex={2}
              />
            )}
            {sectionIndex === HELP_AND_FEEDBACK_INDEX && <HelpAndFeedback />}
          </main>
        </React.Fragment>
      )}
    </Layout>
  )
}

GlobalPreferences.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  compact: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  toast: PropTypes.func,
  wrapper: AragonType,
  locator: PropTypes.object,
  sectionIndex: PropTypes.number,
  subsection: PropTypes.string,
  onNavigation: PropTypes.func.isRequired,
}

function useGlobalPreferences(locator = {}) {
  const [sectionIndex, setSectionIndex] = useState(null)
  const [subsection, setSubsection] = useState(null)
  const handleNavigation = useCallback(
    index => {
      window.location.hash = `${getAppPath(
        locator
      )}${GLOBAL_PREFERENCES_QUERY_PARAM}${PATHS[index]}`
    },
    [locator]
  )

  useEffect(() => {
    const { preferences: { path = '' } = {} } = locator
    if (!path) {
      setSectionIndex(null)
      return
    }
    const index = PATHS.findIndex(item => path.startsWith(item))
    setSectionIndex(index === -1 ? null : index)

    // subsection is the part after the PATH, e.g. for `?p=/notifications/verify` - `/verify`
    const subsection = index !== -1 ? path.substring(PATHS[index].length) : null

    setSubsection(subsection)
    // Does the current path start with any of the declared route paths
  }, [locator, sectionIndex])

  return { sectionIndex, subsection, handleNavigation }
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
            & path {
              stroke: ${theme.surfaceIcon};
              stroke-width: 0.3px;
            }
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
  const { sectionIndex, subsection, handleNavigation } = useGlobalPreferences(
    props.locator
  )
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
              subsection={subsection}
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

export default React.memo(props => (
  <Toast timeout={TIMEOUT_TOAST}>
    {toast => <AnimatedGlobalPreferences {...props} toast={toast} />}
  </Toast>
))
