import React, { useEffect, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { ClientStorage } from '../../cache'

const CONSOLE_VISIBLE_KEY = 'CONSOLE_VISIBLE'
export const CONSOLE_COMMAND_HISTORY_KEY = 'CONSOLE_COMMAND_HISTORY'

export const ConsoleVisibleContext = React.createContext()

function ConsoleVisibleProvider({ children }) {
  const [consoleVisible, setConsoleVisible] = useState(
    ClientStorage.getItem(CONSOLE_VISIBLE_KEY) === 'true'
  )

  useEffect(() => {
    ClientStorage.setItem(
      CONSOLE_VISIBLE_KEY,
      consoleVisible ? 'true' : 'false'
    )
  }, [consoleVisible])

  return (
    <ConsoleVisibleContext.Provider
      value={{ consoleVisible, setConsoleVisible }}
    >
      {children}
    </ConsoleVisibleContext.Provider>
  )
}

ConsoleVisibleProvider.propTypes = {
  children: PropTypes.node,
}

function useConsole() {
  return useContext(ConsoleVisibleContext)
}

export { useConsole, ConsoleVisibleProvider }
