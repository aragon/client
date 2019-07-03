import React, { useState } from 'react'
import { Bar, Layout, Header, TabBar } from '@aragon/ui'
import Network from './Network/Network'
import Notifications from './Notifications'
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

// path = PATHS[0]
function GlobalPreferences({ dao, wrapper, path = 'help-and-feedback' }) {
  const [currentSection, setCurrentSection] = useState(
    SECTIONS.has(path) ? PATHS.findIndex(item => item === path) : 0
  )
  const handleChange = index => {
    setCurrentSection(index)
  }

  return (
    <Layout>
      <Header primary="Global preferences" />
      <Bar>
        <TabBar
          items={VALUES}
          onChange={handleChange}
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
  )
}

export default GlobalPreferences
