import React from 'react'

export const AppsContext = React.createContext([])

export const AppsProvider = AppsContext.Provider

export const useApps = () => React.useContext(AppsContext)
