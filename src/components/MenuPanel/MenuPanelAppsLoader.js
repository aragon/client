import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { Button, IconError, LoadingRing, theme } from '@aragon/ui'
import color from 'onecolor'
import { AppsStatusType } from '../../prop-types'
import springs from '../../springs'
import { noop } from '../../utils'
import {
  APPS_STATUS_ERROR,
  APPS_STATUS_READY,
  APPS_STATUS_LOADING,
} from '../../symbols'

class MenuPanelAppsLoader extends React.Component {
  static propTypes = {
    appsStatus: AppsStatusType.isRequired,
    children: PropTypes.func.isRequired,
    expandedInstancesCount: PropTypes.number.isRequired,
    appsCount: PropTypes.number.isRequired,
    onRetry: PropTypes.func.isRequired,
  }

  static defaultProps = {
    children: noop,
    appStatus: APPS_STATUS_LOADING,
    onRetry: noop,
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
        appsCount * 40 +
        expandedInstancesCount * 30 +
        (expandedInstancesCount > 0 ? 5 : 0)
      )
    }
    return appsStatus === APPS_STATUS_ERROR ? 80 : 40
  }

  render() {
    const { children, appsStatus, onRetry } = this.props
    const { showApps, transitionDone } = this.state
    return (
      <Spring
        config={springs.smooth}
        immediate={transitionDone}
        from={{
          afterLoadingMessageProgress: 0,
          showAppsProgress: 0,
          instancesHeight: 40,
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
              <StatusBackground
                style={{
                  opacity: afterLoadingMessageProgress,
                  background:
                    appsStatus === APPS_STATUS_ERROR
                      ? color(theme.negative)
                          .lightness(0.98)
                          .css()
                      : 'transparent',
                }}
              />
              <StatusContent
                style={{
                  opacity: showAppsProgress.interpolate(v => 1 - v),
                  transform: showAppsProgress.interpolate(
                    v => `
                      translate3d(${v * 40}px, 0, 0)
                    `
                  ),
                }}
              >
                <StatusIndicatorWrapper
                  vAlign={appsStatus !== APPS_STATUS_ERROR}
                >
                  {appsStatus === APPS_STATUS_ERROR ? (
                    <IconErrorWrapper
                      style={{ opacity: afterLoadingMessageProgress }}
                    >
                      <IconError />
                    </IconErrorWrapper>
                  ) : (
                    <LoadingRing paused={appsStatus !== APPS_STATUS_LOADING} />
                  )}
                </StatusIndicatorWrapper>
                {(() => {
                  if (appsStatus === APPS_STATUS_LOADING) {
                    return 'Loading apps…'
                  }
                  if (appsStatus === APPS_STATUS_READY) {
                    return 'Apps loaded.'
                  }
                  if (appsStatus === APPS_STATUS_ERROR) {
                    return (
                      <div>
                        <div style={{ marginBottom: '5px' }}>
                          Apps loading error
                        </div>
                        <Button size="mini" onClick={onRetry}>
                          Retry
                        </Button>
                      </div>
                    )
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

const StatusIndicatorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: ${({ vAlign }) => (vAlign ? 'center' : 'flex-start')};
  width: 22px;
  height: 22px;
  margin-right: 15px;
`

const Main = styled(animated.div)`
  position: relative;
  overflow: hidden;
`

const Apps = styled(animated.div)`
  position: relative;
  z-index: 2;
  background: white;
`

const Status = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: 30px;
  overflow: hidden;
  background: white;
`

const StatusBackground = styled(animated.div)`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const IconErrorWrapper = styled(animated.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const StatusContent = styled(animated.div)`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
`

export default MenuPanelAppsLoader
