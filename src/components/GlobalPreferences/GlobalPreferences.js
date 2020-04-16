import React, { useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Bar,
  ButtonIcon,
  GU,
  Header,
  IconClose,
  Layout,
  Tabs,
  springs,
  textStyle,
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

const CUSTOM_LABELS_INDEX = 0
const NETWORK_INDEX = 1
const NOTIFICATIONS_INDEX = 2
const HELP_AND_FEEDBACK_INDEX = 3

const AnimatedDiv = animated.div

function GlobalPreferences({
  apps,
  compact,
  onNavigation,
  sectionIndex,
  subsection,
  wrapper,
}) {
  const theme = useTheme()
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
    routing.update({ preferences: {} })
  }, [routing])

  const handleSharedIdentitiesClose = () => {
    handleSharedIdentitiesCancel()
    closePreferences()
  }

  useEsc(closePreferences)

  const tabItems = VALUES.filter((_, index) =>
    Boolean(wrapper || index === NETWORK_INDEX)
  )

  const container = useRef()
  useEffect(() => {
    if (container.current) {
      container.current.focus()
    }
  }, [])

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
            {tabItems.length > 1 ? (
              <Tabs
                items={tabItems}
                onChange={onNavigation}
                selected={sectionIndex}
              />
            ) : (
              <Bar>
                <div
                  css={`
                    display: flex;
                    height: 100%;
                    align-items: center;
                    padding-left: ${compact ? 2 * GU : 3 * GU}px;
                    color: ${compact
                      ? theme.surfaceContent
                      : theme.surfaceContentSecondary};
                    ${textStyle('body2')}
                  `}
                >
                  {tabItems[0]}
                </div>
              </Bar>
            )}
            <main>
              {sectionIndex === CUSTOM_LABELS_INDEX && (
                <CustomLabels wrapper={wrapper} />
              )}
              {sectionIndex === NETWORK_INDEX && <Network wrapper={wrapper} />}
              {sectionIndex === NOTIFICATIONS_INDEX && (
                <Notifications
                  apps={apps}
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
    </div>
  )
}

GlobalPreferences.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  compact: PropTypes.bool,
  onNavigation: PropTypes.func.isRequired,
  sectionIndex: PropTypes.number,
  subsection: PropTypes.string,
  wrapper: AragonType,
}

function useGlobalPreferences({ wrapper }) {
  const routing = useRouting()
  const { preferences } = routing

  const handleNavigation = useCallback(
    index => {
      routing.update({ preferences: { section: PATHS[index] } })
    },
    [routing]
  )

  const { subsection } = preferences

  const sectionIndex = PATHS.findIndex(
    section => section === preferences.section
  )

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

function AnimatedGlobalPreferences(props) {
  const { sectionIndex, subsection, handleNavigation } = useGlobalPreferences({
    wrapper: props.wrapper,
  })

  const { below, above } = useViewport()
  const compact = below('medium')
  const theme = useTheme()

  return (
    <Transition
      native
      items={sectionIndex > -1}
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
            <GlobalPreferences
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

AnimatedGlobalPreferences.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  wrapper: PropTypes.object,
}

export default React.memo(AnimatedGlobalPreferences)
