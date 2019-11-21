import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { LoadingRing, GU, textStyle, springs } from '@aragon/ui'
import { AppsStatusType } from '../../prop-types'
import { APPS_STATUS_READY, APPS_STATUS_LOADING } from '../../symbols'
import { noop } from '../../utils'
import { MENU_PANEL_APP_INSTANCE_HEIGHT } from './MenuPanelAppInstance'
import { MENU_ITEM_BASE_HEIGHT } from './MenuPanelAppGroup'

const BASE_LOADER_HEIGHT = 40

class MenuPanelAppsLoader extends React.Component {
  static propTypes = {
    appsStatus: AppsStatusType.isRequired,
    children: PropTypes.func.isRequired,
    expandedInstancesCount: PropTypes.number.isRequired,
    appsCount: PropTypes.number.isRequired,
  }

  static defaultProps = {
    children: noop,
    appStatus: APPS_STATUS_LOADING,
  }

  state = {
    showApps: false,
    transitionDone: false,
  }

  componentWillReceiveProps({ appsStatus }) {
    if (appsStatus !== this.props.appsStatus) {
      // Always set this to false to reinitialize the animation
      this.setState({ showApps: false, transitionDone: false })
    }
  }

  handleRest = () => {
    const { showApps } = this.state

    if (this.props.appsStatus === APPS_STATUS_READY) {
      this.setState({
        // `showApps: true` triggers the transition showing the apps.
        showApps: true,

        // The second time handleRest() is called, showApps is `true`, which
        // means that we reached the end of the transition.
        transitionDone: showApps,
      })
    }
  }

  getInstancesHeight() {
    const { appsStatus, appsCount, expandedInstancesCount } = this.props
    const { showApps, transitionDone } = this.state
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
  }

  render() {
    const { appsStatus, children } = this.props
    const { showApps, transitionDone } = this.state
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
          afterLoadingMessageProgress: Number(
            appsStatus !== APPS_STATUS_LOADING
          ),
          showAppsProgress: Number(showApps),
          instancesHeight: this.getInstancesHeight(),
        }}
        onRest={this.handleRest}
        native
      >
        {({
          afterLoadingMessageProgress,
          showAppsProgress,
          instancesHeight,
        }) => (
          <Main
            style={{
              height: instancesHeight.interpolate(v =>
                v === -1 ? 'auto' : `${v}px`
              ),
            }}
          >
            <Status>
              <StatusContent
                style={{
                  opacity: showAppsProgress.interpolate(v => 1 - v),
                  transform: showAppsProgress.interpolate(
                    v => `
                      translate3d(${v * BASE_LOADER_HEIGHT}px, 0, 0)
                    `
                  ),
                }}
              >
                <LoadingRing
                  paused={appsStatus !== APPS_STATUS_LOADING}
                  css={`
                    margin-right: ${1 * GU}px;
                  `}
                />
                {(() => {
                  if (appsStatus === APPS_STATUS_LOADING) {
                    return 'Loading apps…'
                  }
                  if (appsStatus === APPS_STATUS_READY) {
                    return 'Apps loaded.'
                  }
                  return null
                })()}
              </StatusContent>
            </Status>
            <Apps
              style={{
                opacity: showAppsProgress,
                transform: showAppsProgress.interpolate(
                  v => `
                    translate3d(-${(1 - v) * 60}px, 0, 0)
                  `
                ),
              }}
            >
              {children()}
            </Apps>
          </Main>
        )}
      </Spring>
    )
  }
}

const Main = styled(animated.div)`
  position: relative;
  overflow: hidden;
`

const Apps = styled(animated.div)`
  position: relative;
  z-index: 2;
`

const Status = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: ${3 * GU}px;
  overflow: hidden;
`

const StatusContent = styled(animated.div)`
  display: flex;
  align-items: center;
  ${textStyle('body2')}
`

export default MenuPanelAppsLoader
