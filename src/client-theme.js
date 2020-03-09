import React, { useCallback, useContext, useMemo, useState } from 'react'
import { getClientTheme, setClientTheme } from './local-settings'

const SETTINGS_THEME = getClientTheme()
const ClientThemeContext = React.createContext(SETTINGS_THEME)

function ClientThemeProvider(props) {
  const [appearance, setAppearance] = useState(SETTINGS_THEME.appearance)
  const [theme, setTheme] = useState(SETTINGS_THEME.theme)

  const toggleAppearance = useCallback(() => {
    const newAppearance = appearance === 'light' ? 'dark' : 'light'
    setAppearance(newAppearance)
    setTheme(null)
    setClientTheme(newAppearance)
  }, [appearance])

  const clientTheme = useMemo(
    () => ({
      appearance,
      theme,
      toggleAppearance,
    }),
    [appearance, theme, toggleAppearance]
  )

  return <ClientThemeContext.Provider value={clientTheme} {...props} />
}

function useClientTheme() {
  return useContext(ClientThemeContext)
}

export { ClientThemeProvider, useClientTheme }
