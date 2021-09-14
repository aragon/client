import React, { useMemo, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { init as initApm } from '@elastic/apm-rum'
import { afterFrame } from '@elastic/apm-rum-core'

const UseAPMContext = React.createContext()

function APMProvider({ children }) {
  const [apm, setApm] = useState(() => {
    if (
      process.env.REACT_APP_DEPLOY_VERSION &&
      process.env.REACT_APP_DEPLOY_ENVIRONMENT
    ) {
      return initApm({
        serviceName: 'client',
        serverUrl: 'https://apm-monitoring.aragon.org',
        serviceVersion: process.env.REACT_APP_DEPLOY_VERSION,
        environment: process.env.REACT_APP_DEPLOY_ENVIRONMENT,
      })
    } else {
      console.warn(
        'REACT_APP_DEPLOY_VERSION or REACT_APP_DEPLOY_ENVIRONMENT is not provided.'
      )
      return null
    }
  })

  const contextValue = useMemo(() => {
    return { apm, setApm }
  }, [apm, setApm])

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

function updateAPMContext(apm, networkType) {
  if (apm && networkType) {
    const context = { networkType: networkType }
    apm.addLabels(context)
    apm.setCustomContext(context)
  }
}

updateAPMContext.propTypes = {
  apm: PropTypes.any,
  networkType: PropTypes.string,
}

function instrumentAPMRouts(apm, routingMod) {
  if (apm && routingMod) {
    const { instanceId, instancePath, name, status } = routingMod
    const path = status
      ? `${name}/${status}`
      : `${name}/${instanceId}${instancePath}`

    const tx = apm.startTransaction(path, 'route-change', {
      managed: false,
      canReuse: false,
    })

    afterFrame(() => {
      tx && tx.detectFinish()
    })
  }
}

instrumentAPMRouts.propTypes = {
  apm: PropTypes.any,
  routing: PropTypes.any,
}

export { useAPM, APMProvider, updateAPMContext, instrumentAPMRouts }
