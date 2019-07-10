import React, { useState, useEffect } from 'react'
import {
  Bar,
  ButtonIcon,
  GU,
  IconClose,
  Layout,
  Header,
  TabBar,
  Toast,
  useTheme,
} from '@aragon/ui'
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
  const theme = useTheme()
  const {
    setCurrentSection,
    currentSection,
    handleNavigation,
  } = useGlobalPreferences()
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

  if (!opened) {
    return null
  }

  return (
    <div
      css={`
        border-top: 2px solid ${theme.accent};
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 11;
        height: 100vh;
        background: ${theme.surface};
        overflow: auto;
      `}
    >
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

function useGlobalPreferences() {
  const [currentSection, setCurrentSection] = useState(0)
  const handleNavigation = index => {
    const { hash } = window.location
    const path = hash.substr(
      hash.indexOf(GLOBAL_PREFERENCES_QUERY_PARAM) +
        GLOBAL_PREFERENCES_QUERY_PARAM.length
    )
    const rest = hash.substr(0, hash.indexOf(GLOBAL_PREFERENCES_QUERY_PARAM))
    window.location.hash = `${rest}?p=/${PATHS[index]}`
  }

  useEffect(() => {
    const { hash } = window.location
    const path = hash.substr(
      hash.indexOf(GLOBAL_PREFERENCES_QUERY_PARAM) +
        GLOBAL_PREFERENCES_QUERY_PARAM.length
    )
    setCurrentSection(
      SECTIONS.has(path) ? PATHS.findIndex(item => item === path) : 0
    )
  }, [window.location.hash])

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

export default props => (
  <Toast timeout={TIMEOUT_TOAST}>
    {toast => <GlobalPreferences {...props} toast={toast} />}
  </Toast>
)
