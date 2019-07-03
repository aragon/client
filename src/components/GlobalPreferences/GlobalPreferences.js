import React, { useState, useEffect } from 'react'
import { Bar, ButtonIcon, IconClose, Layout, Header, TabBar } from '@aragon/ui'
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

function GlobalPreferences({ dao, wrapper, onClose, opened }) {
  const { setCurrentSection, currentSection } = useGlobalPreferences()

  if (!opened) {
    return null
  }

  return (
    <div
      css={`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 11;
        background: white;
      `}
    >
      <View
        dao={dao}
        wrapper={wrapper}
        onClose={onClose}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
    </div>
  )
}

// path = PATHS[0]
function useGlobalPreferences() {
  const [currentSection, setCurrentSection] = useState(0)

  // effect for location url?
  //useEffect(() => {
  //setCurrentSection(
  //SECTIONS.has(path) ? PATHS.findIndex(item => item === path) : 0
  //)
  //}, [path])

  return { setCurrentSection, currentSection }
}

function View({ dao, wrapper, onClose, currentSection, setCurrentSection }) {
  return (
    <React.Fragment>
      <Close onClick={onClose} />
      <Layout>
        <Header primary="Global preferences" />
        <Bar>
          <TabBar
            items={VALUES}
            onChange={setCurrentSection}
            selected={currentSection}
          />
        </Bar>
        <main>
          {currentSection === 0 && <CustomLabels dao={dao} wrapper={wrapper} />}
          {currentSection === 1 && <Network wrapper={wrapper} />}
          {currentSection === 2 && <Notifications />}
          {currentSection === 3 && <HelpAndFeedback />}
        </main>
      </Layout>
    </React.Fragment>
  )
}

function Close({ onClick }) {
  return (
    <div css="text-align: right;">
      <ButtonIcon onClick={onClick}>
        <IconClose />
      </ButtonIcon>
    </div>
  )
}

export default GlobalPreferences
