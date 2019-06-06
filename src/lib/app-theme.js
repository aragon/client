import React, { useCallback, useContext, useState } from 'react'
import { Theme } from '@aragon/ui'

const AppThemeContext = React.createContext()

function AppTheme({ children }) {
  const [theme, setTheme] = useState('light')
  const toggleTheme = useCallback(() => {
    setTheme(theme => (theme === 'light' ? 'dark' : 'light'))
  }, [])

  return (
    <AppThemeContext.Provider value={{ toggleTheme, themeName: theme }}>
      <Theme theme={theme}>{children}</Theme>
    </AppThemeContext.Provider>
  )
}

function useAppTheme() {
  return useContext(AppThemeContext)
}

export { AppTheme, useAppTheme }
