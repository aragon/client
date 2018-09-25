import React from 'react'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { IconAttention, Text } from '@aragon/ui'
import { lerp } from '../../math-utils'
import { noop } from '../../utils'
import LoadingRing from '../LoadingRing'
import {
  APPS_STATUS_ERROR,
  APPS_STATUS_READY,
  APPS_STATUS_LOADING,
} from '../../symbols'

class MenuPanelAppsLoader extends React.Component {
  static defaultProps = {
    children: noop,
    itemsCount: 0,
    appStatus: APPS_STATUS_LOADING,
    onRetry: noop,
  }

  state = {
    showApps: false,
  }

  componentWillReceiveProps({ appsStatus }) {
    if (appsStatus !== this.props.appsStatus) {
      this.setState({ showApps: false })
    }
  }

  handleRest = () => {
    if (this.props.appsStatus === APPS_STATUS_READY) {
      setTimeout(() => {
        this.setState({ showApps: true })
      }, 0)
    }
  }

  render() {
    const { children, itemsCount, appsStatus } = this.props
    const { showApps } = this.state
    return (
      <Spring
        config={{ tension: 800, friction: 60 }}
        from={{ afterLoadingMessageProgress: 0, showAppsProgress: 0 }}
        to={{
          afterLoadingMessageProgress: Number(
            appsStatus !== APPS_STATUS_LOADING
          ),
          showAppsProgress: Number(showApps),
        }}
        onRest={this.handleRest}
        native
      >
        {({ afterLoadingMessageProgress, showAppsProgress }) => (
          <Main>
            <Status
              style={{
                cursor:
                  appsStatus === APPS_STATUS_ERROR ? 'pointer' : 'inherit',
              }}
              onClick={
                appsStatus === APPS_STATUS_ERROR ? this.props.onRetry : noop
              }
            >
              <StatusBackground
                style={{ opacity: afterLoadingMessageProgress }}
              />
              <StatusContent>
                <StatusIndicatorWrapper
                  style={{
                    alignSelf:
                      appsStatus === APPS_STATUS_ERROR
                        ? 'flex-start'
                        : 'center',
                  }}
                >
                  {appsStatus === APPS_STATUS_ERROR ? (
                    <IconAttention />
                  ) : (
                    <LoadingRing spin={appsStatus === APPS_STATUS_LOADING} />
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
                        <div>Apps loading error</div>
                        <Text size="xxsmall">Click to try again.</Text>
                      </div>
                    )
                  }
                  return null
                })()}
              </StatusContent>
            </Status>
            <Apps
              style={{
                height: afterLoadingMessageProgress.interpolate(v => {
                  const height = lerp(
                    Math.min(1, v),
                    40,
                    (appsStatus === APPS_STATUS_READY ? itemsCount : 2) * 40
                  )
                  return `${height}px`
                }),
                transform: showAppsProgress.interpolate(
                  v => `
                    translate3d(-${(1 - Math.min(1, v)) * 100}%, 0, 0)
                  `
                ),
              }}
            >
              {children(false)}
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
  width: 22px;
  height: 22px;
  margin-right: 15px;
`

const Main = styled.div`
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
  background: #f5f9fa;
`

const StatusContent = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
`

export default MenuPanelAppsLoader
