import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { IconError, Button, theme, springs } from '@aragon/ui'
import color from 'onecolor'
import { lerp } from '../../math-utils'
import { noop } from '../../utils'
import LoadingRing from '../LoadingRing'
import {
  APPS_STATUS_ERROR,
  APPS_STATUS_READY,
  APPS_STATUS_LOADING,
} from '../../symbols'

class MenuPanelAppsLoader extends React.Component {
  static propTypes = {
    appsStatus: PropTypes.oneOf([
      APPS_STATUS_ERROR,
      APPS_STATUS_READY,
      APPS_STATUS_LOADING,
    ]).isRequired,
    children: PropTypes.func.isRequired,
    itemsCount: PropTypes.number.isRequired,
    onRetry: PropTypes.func.isRequired,
  }

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
      // Always set this to false to reinitialize the animation
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
    const { children, itemsCount, appsStatus, onRetry } = this.props
    const { showApps } = this.state
    return (
      <Spring
        config={springs.swift}
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
            <Status>
              <StatusBackground
                style={{
                  opacity: afterLoadingMessageProgress,
                  background:
                    appsStatus === APPS_STATUS_ERROR
                      ? color(theme.negative)
                          .lightness(0.98)
                          .css()
                      : '#f5f9fa',
                }}
              />
              <StatusContent>
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
                height: afterLoadingMessageProgress.interpolate(
                  v =>
                    `${lerp(
                      v,
                      40,
                      (appsStatus === APPS_STATUS_READY ? itemsCount : 2) * 40
                    )}px`
                ),
                transform: showAppsProgress.interpolate(
                  v => `
                    translate3d(-${(1 - Math.min(1, v)) * 100}%, 0, 0)
                  `
                ),
              }}
            >
              {children(showApps)}
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
`

const IconErrorWrapper = styled(animated.div)`
  display: flex;
  align-items: center;
  justify-content: center;
`

const StatusContent = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
`

export default MenuPanelAppsLoader
