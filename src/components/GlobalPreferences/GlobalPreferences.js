import React, { useState } from 'react'
import { TabBar } from '@aragon/ui'
import Network from './Network/Network'
import useNetwork from './Network/useNetwork'
import Notifications from './Notifications'
import CustomLabels from './CustomLabels'
import HelpAndFeedback from './HelpAndFeedback'

const SECTIONS = new Map([
  ['custom-labels', 'Custom Labels'],
  ['network', 'Network'],
  ['notifications', 'Notifications'],
  ['help-and-feedback', 'Help and feedback'],
])
const PATHS = Array.from(SECTIONS.keys())
const VALUES = Array.from(SECTIONS.values())

// path = PATHS[0]
function GlobalPreferences({ wrapper, path = 'custom-labels' }) {
  const [currentSection, setCurrentSection] = useState(
    SECTIONS.has(path) ? PATHS.findIndex(item => item === path) : 0
  )
  const handleChange = index => {
    setCurrentSection(index)
  }

  const {
    ethNode,
    ipfsGateway,
    handleNetworkChange,
    handleClearCache,
    networkError,
    setIpfsGateway,
    setEthNode,
    network,
  } = useNetwork(wrapper)

  return (
    <section>
      <h2>Global preferences</h2>
      <TabBar
        items={VALUES}
        onChange={handleChange}
        selected={currentSection}
      />
      <main>
        {currentSection === 0 && <CustomLabels />}
        {currentSection === 1 && (
          <Network
            ethNode={ethNode}
            ipfsGateway={ipfsGateway}
            onSave={handleNetworkChange}
            onClear={handleClearCache}
            error={networkError}
            onChangeEthNode={setEthNode}
            onChangeIpfsGateway={setIpfsGateway}
            network={network}
          />
        )}
        {currentSection === 2 && <Notifications />}
        {currentSection === 3 && <HelpAndFeedback />}
      </main>
    </section>
  )
}

export default GlobalPreferences
