import React, { useEffect, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const CONSOLE_OPTOUT_KEY = 'CONSOLE_OPTOUT'
export const CONSOLE_COMMAND_HISTORY_KEY = 'CONSOLE_COMMAND_HISTORY'

export const ConsoleOptOutContext = React.createContext()

function ConsoleOptOutProvider({ children }) {
  const [optedOut, setOptedOut] = useState(
    localStorage.getItem(CONSOLE_OPTOUT_KEY) === 'true'
  )

  useEffect(() => {
    localStorage.setItem(CONSOLE_OPTOUT_KEY, optedOut ? 'true' : 'false')
  }, [optedOut])

  return (
    <ConsoleOptOutContext.Provider value={{ optedOut, setOptedOut }}>
      {children}
    </ConsoleOptOutContext.Provider>
  )
}

ConsoleOptOutProvider.propTypes = {
  children: PropTypes.node,
}

function useConsole() {
  return useContext(ConsoleOptOutContext)
}

export { useConsole, ConsoleOptOutProvider }