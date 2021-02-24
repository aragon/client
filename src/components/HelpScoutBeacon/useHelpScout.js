import React, { useEffect, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const HELPSCOUT_OPTOUT_KEY = 'HELPSCOUT_OPTOUT'

const HelpScoutContext = React.createContext()

function HelpScoutProvider({ children }) {
  const [optedOut, setOptedOut] = useState(
    localStorage.getItem(HELPSCOUT_OPTOUT_KEY) === 'true'
  )

  useEffect(() => {
    if (optedOut && window.Beacon) {
      window.Beacon('destroy')
    }
    localStorage.setItem(HELPSCOUT_OPTOUT_KEY, optedOut ? 'true' : 'false')
  }, [optedOut])

  return (
    <HelpScoutContext.Provider value={{ optedOut, setOptedOut }}>
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
