import React, { useState, useEffect } from 'react'
import {
  Bar,
  ButtonIcon,
  GU,
  IconClose,
  Layout,
  Header,
  TabBar,
  useTheme,
} from '@aragon/ui'
import Network from './Network/Network'
import Notifications from './Notifications/Notifications'
import CustomLabels from './CustomLabels/CustomLabels'
import HelpAndFeedback from './HelpAndFeedback/HelpAndFeedback'

const SECTIONS = new Map([
  ['custom-labels', 'Custom Labels'],
  ['network', 'Network'],
  ['notifications', 'Notifications'],
  ['help-and-feedback', 'Help and feedback'],
])
const PATHS = Array.from(SECTIONS.keys())
const VALUES = Array.from(SECTIONS.values())
const GLOBAL_PREFERENCES_QUERY_PARAM = '?p=/'

function GlobalPreferences({
  dao,
  wrapper,
  onClose,
  opened,
  helpScoutOptedOut,
  onHelpScoutOptedOutChange,
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
        background: ${theme.surface};
        overflow: auto;
      `}
    >
      <Close onClick={onClose} />
      <Layout>
        <Header primary="Global preferences" />
        <Bar>
          <TabBar
            items={VALUES}
            onChange={handleSectionChange}
            selected={currentSection}
          />
        </Bar>
        <main>
          {currentSection === 0 && <CustomLabels dao={dao} wrapper={wrapper} />}
          {currentSection === 1 && <Network wrapper={wrapper} />}
          {currentSection === 2 && <Notifications />}
          {currentSection === 3 && (
            <HelpAndFeedback
              optedOut={helpScoutOptedOut}
              onOptOutChange={onHelpScoutOptedOutChange}
            />
          )}
        </main>
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

export default GlobalPreferences
