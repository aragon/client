import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'

const HELPSCOUT_OPTOUT_KEY = 'HELPSCOUT_OPTOUT'

const HelpScoutContext = React.createContext()

function HelpScoutProvider({ children }) {
  const [optedOut, setOptedOut] = useState(
    localStorage.getItem(HELPSCOUT_OPTOUT_KEY) === 'true'
  )
  const handleOptOut = out => {
    if (out && window.Beacon) {
      window.Beacon('destroy')
    }
    localStorage.setItem(HELPSCOUT_OPTOUT_KEY, out ? 'true' : 'false')
    setOptedOut(out)
  }

  return (
    <HelpScoutContext.Provider value={{ optedOut, setOptedOut: handleOptOut }}>
      {children}
    </HelpScoutContext.Provider>
  )
}

HelpScoutProvider.propTypes = {
  children: PropTypes.node,
}

function useHelpScout() {
  return useContext(HelpScoutContext)
}

export { useHelpScout, HelpScoutProvider }
