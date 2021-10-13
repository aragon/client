import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Spring, animated } from 'react-spring'
import { LoadingRing, GU, textStyle, springs } from '@aragon/ui'
import { AppsStatusType } from '../../prop-types'
import { APPS_STATUS_READY, APPS_STATUS_LOADING } from '../../symbols'
import { noop } from '../../util/utils'
import { MENU_PANEL_APP_INSTANCE_HEIGHT } from './MenuPanelAppInstance'
import { MENU_ITEM_BASE_HEIGHT } from './MenuPanelAppGroup'

const AnimatedDiv = animated.div

const BASE_LOADER_HEIGHT = 5 * GU
const X_SHIFT = 5 * GU

function MenuPanelAppsLoader({ appsStatus, children, expandedInstancesCount }) {
  const [showApps, setShowApps] = useState(false)
  const [transitionDone, setTransitionDone] = useState(false)

  const appsCount = React.Children.count(children)

  // Reinitialize the animation when appsStatus changes
  useEffect(() => {
    setShowApps(false)
    setTransitionDone(false)
  }, [appsStatus])

  const handleRest = useCallback(() => {
    if (appsStatus === APPS_STATUS_READY) {
      // Triggers the transition showing the apps.
      setShowApps(true)

      // The second time handleRest() is called, showApps is `true`,
      // which means that we have reached the end of the two-steps transition.
      setTransitionDone(showApps)
    }
  }, [showApps, appsStatus])

  const instancesHeight = useMemo(() => {
    if (transitionDone) {
      return -1
    }
    if (appsStatus === APPS_STATUS_READY || showApps) {
      return (
        appsCount * MENU_ITEM_BASE_HEIGHT +
        expandedInstancesCount * MENU_PANEL_APP_INSTANCE_HEIGHT
      )
    }
    return BASE_LOADER_HEIGHT
  }, [appsCount, appsStatus, expandedInstancesCount, showApps, transitionDone])

  const statusLabel = useMemo(() => {
    if (appsStatus === APPS_STATUS_LOADING) {
      return 'Loading apps…'
    }
    if (appsStatus === APPS_STATUS_READY) {
      return 'Apps loaded.'
    }
    return null
  }, [appsStatus])

  return (
    <Spring
      config={springs.smooth}
      immediate={transitionDone}
      from={{
        afterLoadingMessageProgress: 0,
        showAppsProgress: 0,
        instancesHeight: BASE_LOADER_HEIGHT,
      }}
      to={{
        afterLoadingMessageProgress: Number(appsStatus !== APPS_STATUS_LOADING),
        showAppsProgress: Number(showApps),
        instancesHeight,
      }}
      onRest={handleRest}
      native
    >
      {({ afterLoadingMessageProgress, showAppsProgress, instancesHeight }) => (
        <AnimatedDiv
          style={{
            height: instancesHeight.interpolate(v =>
              v === -1 ? 'auto' : `${v}px`
            ),
          }}
          css={`
            position: relative;
            overflow: hidden;
          `}
        >
          <div
            css={`
              position: absolute;
              z-index: 1;
              top: 0;
              bottom: 0;
              display: flex;
              align-items: center;
              width: 100%;
              padding-left: ${3 * GU}px;
              overflow: hidden;
            `}
          >
            <div
              style={{ opacity: Number(!showApps) }}
              css={`
                display: flex;
                align-items: center;
                ${textStyle('body2')}
              `}
            >
              <LoadingRing
                paused={appsStatus !== APPS_STATUS_LOADING}
                css={`
                  margin-right: ${1 * GU}px;
                `}
              />
              {statusLabel}
            </div>
          </div>
          <AnimatedDiv
            style={{
              opacity: showAppsProgress,
              transform: showAppsProgress.interpolate(
                v => `translate3d(${(1 - v) * -X_SHIFT}px, 0, 0)`
              ),
            }}
            css={`
              position: relative;
              z-index: 2;
            `}
          >
            {children}
          </AnimatedDiv>
        </AnimatedDiv>
      )}
    </Spring>
  )
}

MenuPanelAppsLoader.propTypes = {
  appsStatus: AppsStatusType.isRequired,
  children: PropTypes.node.isRequired,
  expandedInstancesCount: PropTypes.number.isRequired,
}

MenuPanelAppsLoader.defaultProps = {
  children: noop,
  appsStatus: APPS_STATUS_LOADING,
}

export default MenuPanelAppsLoader
