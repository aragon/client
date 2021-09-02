import React, { useMemo, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { init as initApm, ApmBase, AgentConfigOptions } from '@elastic/apm-rum'
import { useWallet } from './wallet'

const UseAPMContext = React.createContext()

function APMProvider({ children }) {
  const { networkType } = useWallet()
  const [apm, setApm] = useState(null)

  useEffect(() => {
    if (
      process.env.REACT_APP_DEPLOY_VERSION &&
      process.env.REACT_APP_DEPLOY_ENVIRONMENT &&
      !apm
    ) {
      setApm(
        initApm({
          serviceName: 'client',
          serverUrl: 'https://apm-monitoring.aragon.org',
          serviceVersion: process.env.REACT_APP_DEPLOY_VERSION,
          environment: process.env.REACT_APP_DEPLOY_ENVIRONMENT,
        })
      )
    } else {
      console.warn(
        'REACT_APP_DEPLOY_VERSION or REACT_APP_DEPLOY_ENVIRONMENT not provided.'
      )
    }
  }, [])

  useEffect(() => {
    if (apm && networkType) {
      const context = { networkType: networkType }
      apm.addLabels(context)
      apm.setCustomContext(context)
    }
  }, [apm, networkType])

  const contextValue = useMemo(() => apm, [apm])

  return (
    <UseAPMContext.Provider value={contextValue}>
      {children}
    </UseAPMContext.Provider>
  )
}

APMProvider.propTypes = {
  children: PropTypes.node,
}

function useAPM() {
  return useContext(UseAPMContext)
}

export { useAPM, APMProvider }
