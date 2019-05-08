import React, { useCallback, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import { useApps } from '../../contexts/AppsContext'

const APP_TYPE_INTERNAL = Symbol('APP_TYPE_INTERNAL')
const APP_TYPE_EXTERNAL = Symbol('APP_TYPE_EXTERNAL')
const APP_TYPE_NOTFOUND = Symbol('APP_TYPE_NOTFOUND')

const INTERNAL_APPS = ['home', 'permissions', 'apps', 'settings']

const LOADING_ORG = 'Loading organization…'
const LOADING_APPS = 'Loading apps…'
const LOADING_APP = 'Loading {APP}…'
const LOADING_READY = 'Ready.'

// Pick the loading steps depending on what
// is being loaded (internal vs.  external app)
const LOADING_STEPS_INTERNAL = {
  steps: [LOADING_ORG, LOADING_APPS, LOADING_READY],
  stepIndex: ({ daoLoading, appsLoading }) =>
    // pick the first truthy item as the current step
    [daoLoading, appsLoading, true].findIndex(v => v),
}

const LOADING_STEPS_EXTERNAL = {
  steps: [LOADING_ORG, LOADING_APPS, LOADING_APP, LOADING_READY],
  stepIndex: ({ daoLoading, appsLoading, appLoading }) =>
    // pick the first truthy item as the current step
    [daoLoading, appsLoading, appLoading, true].findIndex(v => v),
}

function getLoadingSteps(instanceId) {
  return INTERNAL_APPS.includes(instanceId)
    ? LOADING_STEPS_INTERNAL
    : LOADING_STEPS_EXTERNAL
}

function useLoadingStatus({
  appLoading,
  appsLoading,
  currentAppName,
  daoLoading,
  instanceId,
}) {
  const [loadingSteps, setLoadingSteps] = useState(null)
  const [loadingStepIndex, setLoadingStepIndex] = useState(0)

  // Update the loading steps if `instanceId` changes
  useEffect(() => {
    const loadingSteps = getLoadingSteps(instanceId)
    setLoadingSteps(loadingSteps)
    setLoadingStepIndex(
      loadingSteps.stepIndex({ daoLoading, appsLoading, appLoading })
    )
  }, [instanceId])

  // Update the step index
  useEffect(() => {
    if (loadingSteps) {
      setLoadingStepIndex(
        loadingSteps.stepIndex({ daoLoading, appsLoading, appLoading })
      )
    }
  }, [daoLoading, appsLoading, appLoading])

  const label = (loadingSteps
    ? loadingSteps.steps[loadingStepIndex]
    : ''
  ).replace(/\{APP\}/, currentAppName || instanceId)

  return {
    label,
    progress: loadingSteps
      ? loadingStepIndex / (loadingSteps.steps.length - 1)
      : 0,
  }
}

const AppLoader = React.memo(function AppLoader({
  appLoading,
  appsLoading,
  children,
  currentAppName,
  daoLoading,
  instanceId,
}) {
  const loadingStatus = useLoadingStatus({
    appLoading,
    appsLoading,
    currentAppName,
    daoLoading,
    instanceId,
  })

  return (
    <div
      css={`
        position: relative;
        width: 100%;
        height: 100%;
      `}
    >
      <div
        css={`
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
        `}
      >
        {children}
      </div>
      <LoadingScreen
        title={loadingStatus.label}
        progress={loadingStatus.progress}
        css="z-index: 2"
      />
    </div>
  )
})

export default AppLoader
