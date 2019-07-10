import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Bar,
  ButtonIcon,
  GU,
  IconClose,
  Layout,
  Header,
  TabBar,
  Toast,
  springs,
  breakpoint,
  useTheme,
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
const GLOBAL_PREFERENCES_QUERY_PARAM = '?p=/'
const TIMEOUT_TOAST = 4000

function GlobalPreferences({
  dao,
  helpScoutOptedOut,
  onClose,
  onHelpScoutOptedOutChange,
  opened,
  toast,
  wrapper,
}) {
  const {
    setCurrentSection,
    currentSection,
    handleNavigation,
  } = useGlobalPreferences(opened)
  const handleSectionChange = index => {
    setCurrentSection(index)
    handleNavigation(index)
  }
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
  } = useSharedLink(wrapper, toast)
  const handleSharedIdentitiesClose = () => {
    handleSharedIdentitiesCancel()
    onClose()
  }
  useEsc(onClose)

  return (
    <div>
      <Close onClick={isSharedLink ? handleSharedIdentitiesClose : onClose} />
      <Layout>
        <Header
          primary={isSharedLink ? 'Save Custom Labels' : 'Global preferences'}
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
            <Bar>
              <TabBar
                items={VALUES}
                onChange={handleSectionChange}
                selected={currentSection}
              />
            </Bar>
            <main>
              {currentSection === 0 && (
                <CustomLabels dao={dao} wrapper={wrapper} />
              )}
              {currentSection === 1 && <Network wrapper={wrapper} />}
              {currentSection === 2 && <Notifications />}
              {currentSection === 3 && (
                <HelpAndFeedback
                  optedOut={helpScoutOptedOut}
                  onOptOutChange={onHelpScoutOptedOutChange}
                />
              )}
            </main>
          </React.Fragment>
        )}
      </Layout>
    </div>
  )
}

GlobalPreferences.propTypes = {
  dao: PropTypes.string,
  helpScoutOptedOut: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onHelpScoutOptedOutChange: PropTypes.func.isRequired,
  opened: PropTypes.bool,
  toast: PropTypes.func,
  wrapper: AragonType,
}

function useGlobalPreferences(opened) {
  const [currentSection, setCurrentSection] = useState(0)
  const handleNavigation = useCallback(index => {
    const { hash } = window.location
    const path = hash.substr(
      hash.indexOf(GLOBAL_PREFERENCES_QUERY_PARAM) +
        GLOBAL_PREFERENCES_QUERY_PARAM.length
    )
    const rest = hash.substr(0, hash.indexOf(GLOBAL_PREFERENCES_QUERY_PARAM))
    window.location.hash = `${rest}?p=/${PATHS[index]}`
  },[window.location.hash])

  useEffect(() => {
    if (!opened) {
      return
    }
    const { hash } = window.location
    const path = hash.substr(
      hash.indexOf(GLOBAL_PREFERENCES_QUERY_PARAM) +
        GLOBAL_PREFERENCES_QUERY_PARAM.length
    )
    setCurrentSection(
      SECTIONS.has(path) ? PATHS.findIndex(item => item === path) : 0
    )
  }, [window.location.hash, opened])

  return { setCurrentSection, currentSection, handleNavigation }
}

function Close({ onClick }) {
  return (
    <div
      css={`
        text-align: right;
        padding-top: ${2.5 * GU}px;
        padding-right: ${3 * GU}px;
      `}
    >
      <ButtonIcon onClick={onClick} label="Close">
        <IconClose />
      </ButtonIcon>
    </div>
  )
}

Close.propTypes = {
  onClick: PropTypes.func.isRequired,
}

function AnimatedGlobalPreferences({ opened, ...props }) {
  const { below } = useViewport()
  const smallView = below('medium')
  const theme = useTheme()

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
        // z-index 2 on mobile keeps the menu above this preferences modal
        (({ opacity, enterProgress, blocking }) => (
          <AnimatedWrap
            accent={theme.accent}
            surface={theme.surface}
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
            <GlobalPreferences {...props} opened={opened} />
          </AnimatedWrap>
        ))
      /* eslint-enable react/prop-types */
      }
    </Transition>
  )
}

const AnimatedWrap = styled(animated.div)`
  position: fixed;
  background: #fff;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  min-width: 320px;
  border-top: ${({ accent }) => `2px solid ${accent}`};
  background: ${({ surface }) => surface};
  overflow: auto;
  padding-bottom: ${2 * GU}px;

  ${breakpoint('medium', `padding-bottom:0;`)}
`

export default props => (
  <Toast timeout={TIMEOUT_TOAST}>
    {toast => <AnimatedGlobalPreferences {...props} toast={toast} />}
  </Toast>
)
