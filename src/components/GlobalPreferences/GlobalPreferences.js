import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  ButtonIcon,
  GU,
  Header,
  IconClose,
  Layout,
  Tabs,
  noop,
  springs,
  useKeyDown,
  useTheme,
  useToast,
  useViewport,
} from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import keycodes from '../../keycodes'
import { AragonType, AppType } from '../../prop-types'
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
const SECTION_PATHS = Array.from(SECTIONS.keys())
const SECTION_VALUES = Array.from(SECTIONS.values())

const CUSTOM_LABELS_INDEX = 0
const NETWORK_INDEX = 1
const NOTIFICATIONS_INDEX = 2
const HELP_AND_FEEDBACK_INDEX = 3

const AnimatedDiv = animated.div

function GlobalPreferencesContent({
  apps,
  compact,
  historyPush,
  locator,
  onClose,
  onNavigation,
  onScreenChange,
  sectionIndex,
  subsection,
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

  const handleSharedIdentitiesClose = useCallback(() => {
    handleSharedIdentitiesCancel()
    onClose()
  }, [handleSharedIdentitiesCancel, onClose])

  useKeyDown(keycodes.esc, onClose)

  const container = useRef()
  useEffect(() => {
    if (container.current) {
      container.current.focus()
    }
  }, [])

  const [menuItems, menuItemIndex] = useMemo(() => {
    // Only show network preferences if the `wrapper` does not exist yet (for example, during onboarding)
    return wrapper
      ? [SECTION_VALUES, sectionIndex]
      : [[SECTION_VALUES[NETWORK_INDEX]], 0]
  }, [wrapper, sectionIndex])

  return (
    <div ref={container} tabIndex="0" css="outline: 0">
      <Layout css="z-index: 2">
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
              items={menuItems}
              onChange={wrapper ? onNavigation : noop}
              selected={menuItemIndex}
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
              {sectionIndex === HELP_AND_FEEDBACK_INDEX && (
                <HelpAndFeedback
                  historyPush={historyPush}
                  locator={locator}
                  onClose={onClose}
                />
              )}
            </main>
          </React.Fragment>
        )}
      </Layout>
    </div>
  )
}

GlobalPreferencesContent.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  compact: PropTypes.bool,
  historyPush: PropTypes.func.isRequired,
  locator: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onNavigation: PropTypes.func.isRequired,
  onScreenChange: PropTypes.func.isRequired,
  sectionIndex: PropTypes.number,
  subsection: PropTypes.string,
  wrapper: AragonType,
}

function useGlobalPreferences({ locator = {}, onScreenChange, wrapper }) {
  const [sectionIndex, setSectionIndex] = useState(null)
  const [subsection, setSubsection] = useState(null)
  const handleNavigation = useCallback(
    index => {
      onScreenChange(SECTION_PATHS[index])
    },
    [onScreenChange]
  )

  useEffect(() => {
    const { preferences: { path = '' } = {} } = locator
    if (!path) {
      setSectionIndex(null)
      return
    }
    const index = SECTION_PATHS.findIndex(item => path.startsWith(item))

    if (index !== NETWORK_INDEX && !wrapper) {
      return
    }
    setSectionIndex(index === -1 ? null : index)

    // subsection is the part after the PATH, e.g. for `?p=/notifications/verify` - `/verify`
    const subsection =
      index !== -1 ? path.substring(SECTION_PATHS[index].length) : null

    setSubsection(subsection)
    // Does the current path start with any of the declared route paths
  }, [locator, sectionIndex, wrapper])

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

function GlobalPreferences(props) {
  const { sectionIndex, subsection, handleNavigation } = useGlobalPreferences({
    locator: props.locator,
    onScreenChange: props.onScreenChange,
    wrapper: props.wrapper,
  })

  const { below, above } = useViewport()
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
          <AnimatedDiv
            style={{
              zIndex: 1,
              pointerEvents: blocking ? 'auto' : 'none',
              opacity,
              transform: enterProgress.interpolate(
                v => `
                  translate3d(0, ${(1 - v) * 10}px, 0)
                  scale3d(${1 - (1 - v) * 0.03}, ${1 - (1 - v) * 0.03}, 1)
                `
              ),
            }}
            css={`
              position: fixed;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              overflow: auto;
              min-width: 360px;
              padding-bottom: ${2 * GU}px;
              border-top: 2px solid ${theme.accent};
              background: ${theme.surface};
              ${above('medium') &&
                `
                  padding-bottom: 0;
                `}
            `}
          >
            <GlobalPreferencesContent
              {...props}
              compact={compact}
              sectionIndex={sectionIndex}
              subsection={subsection}
              onNavigation={handleNavigation}
            />
          </AnimatedDiv>
        ))
      /* eslint-enable react/prop-types */
      }
    </Transition>
  )
}

GlobalPreferences.propTypes = {
  locator: PropTypes.object,
  onScreenChange: PropTypes.func.isRequired,
  wrapper: PropTypes.object,
}

export default React.memo(GlobalPreferences)
