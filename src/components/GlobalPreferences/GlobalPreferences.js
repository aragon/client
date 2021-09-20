import React, { useCallback, useEffect, useRef, useMemo } from 'react'
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
  useTheme,
  useToast,
  useViewport,
} from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import { AragonType, AppType } from '../../prop-types'
import { useEsc } from '../../hooks'
import { useRouting } from '../../routing'
import Network from './Network/Network'
import Notifications from './Notifications/Notifications'
import CustomLabels from './CustomLabels/CustomLabels'
import SharedIdentities from './SharedIdentities/SharedIdentities'
import useSharedLink from './SharedIdentities/useSharedLink'
import { useWallet } from '../../contexts/wallet'
import { isOnEthMainnet } from '../../util/network'

const CUSTOM_LABELS_KEY = 'custom-labels'
const NETWORK_KEY = 'network'
const NOTIFICATIONS_KEY = 'notifications'

const SECTIONS = new Map([
  [CUSTOM_LABELS_KEY, 'Custom Labels'],
  [NETWORK_KEY, 'Network'],
  [NOTIFICATIONS_KEY, 'Notifications'],
])
const SECTION_KEYS = Array.from(SECTIONS.keys())

const AnimatedDiv = animated.div

function GlobalPreferencesContent({
  apps,
  compact,
  onNavigation,
  menuKeys,
  menuIndex,
  subsection,
  wrapper,
}) {
  const toast = useToast()
  const routing = useRouting()

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
  } = useSharedLink({ wrapper, toast })

  const closePreferences = useCallback(() => {
    routing.update(locator => ({ ...locator, preferences: {} }))
  }, [routing])

  const handleSharedIdentitiesClose = () => {
    handleSharedIdentitiesCancel()
    closePreferences()
  }

  useEsc(closePreferences)

  const container = useRef()
  useEffect(() => {
    if (container.current) {
      container.current.focus()
    }
  }, [])

  const menuItems = useMemo(() => {
    return menuKeys.map(key => SECTIONS.get(key))
  }, [menuKeys])

  // no menu selected, no need to render anything
  if (menuIndex < 0) {
    return null
  }

  return (
    <div ref={container} tabIndex="0" css="outline: 0">
      <Layout css="z-index: 2">
        <Close
          compact={compact}
          onClick={
            isSharedLink ? handleSharedIdentitiesClose : closePreferences
          }
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
              selected={menuIndex}
            />
            <main>
              {menuKeys[menuIndex] === CUSTOM_LABELS_KEY && (
                <CustomLabels wrapper={wrapper} />
              )}
              {menuKeys[menuIndex] === NETWORK_KEY && (
                <Network wrapper={wrapper} />
              )}
              {menuKeys[menuIndex] === NOTIFICATIONS_KEY && (
                <Notifications
                  apps={apps}
                  subsection={subsection}
                  handleNavigation={onNavigation}
                  navigationIndex={menuIndex}
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
  onNavigation: PropTypes.func.isRequired,
  menuIndex: PropTypes.number,
  menuKeys: PropTypes.arrayOf(PropTypes.string),
  subsection: PropTypes.string,
  wrapper: AragonType,
}

function useGlobalPreferences(wrapper) {
  const routing = useRouting()
  const { preferences } = routing
  const { networkType } = useWallet()

  const menuKeys = useMemo(() => {
    // Only show network preferences if the `wrapper` does not exist yet (for example, during onboarding)
    // Only show network preferences if on mainnet
    const keys = SECTION_KEYS.filter(section => {
      return (
        (isOnEthMainnet(networkType) && section === NETWORK_KEY) ||
        (wrapper && section !== NETWORK_KEY)
      )
    })
    return keys
  }, [wrapper, networkType])

  const handleNavigation = useCallback(
    index => {
      routing.update(locator => ({
        ...locator,
        preferences: { section: menuKeys[index] },
      }))
    },
    [routing, menuKeys]
  )

  const { subsection } = preferences

  const menuIndex = useMemo(() => {
    const index = menuKeys.findIndex(section => section === preferences.section)
    return index
  }, [menuKeys, preferences])

  return {
    menuKeys,
    menuIndex,
    subsection,
    handleNavigation,
  }
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
  const {
    menuKeys,
    menuIndex,
    subsection,
    handleNavigation,
  } = useGlobalPreferences(props.wrapper)

  const { below, above } = useViewport()
  const compact = below('medium')
  const theme = useTheme()

  return (
    <Transition
      native
      items={menuIndex > -1}
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
              menuKeys={menuKeys}
              menuIndex={menuIndex}
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
  apps: PropTypes.arrayOf(AppType).isRequired,
  wrapper: PropTypes.object,
}

export default React.memo(GlobalPreferences)
