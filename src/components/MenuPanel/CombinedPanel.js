import React, { useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { Viewport, springs } from '@aragon/ui'
import {
  AppType,
  AppsStatusType,
  DaoStatusType,
  EthereumAddressType,
} from '../../prop-types'
import { lerp } from '../../math-utils'
import { ActivityContext } from '../../contexts/ActivityContext'
import MenuPanel, {
  MENU_PANEL_WIDTH,
  MENU_PANEL_SHADOW_WIDTH,
} from './MenuPanel'
import ActivityPanel, {
  ACTIVITY_PANEL_WIDTH,
  ACTIVITY_PANEL_SHADOW_WIDTH,
} from '../Activity/ActivityPanel'
import SwipeContainer from './SwipeContainer'

// This component combines MenuPanel and ActivityPanel together.
class CombinedPanel extends React.Component {
  static propTypes = {
    account: EthereumAddressType,
    apps: PropTypes.arrayOf(AppType).isRequired,
    appsStatus: AppsStatusType.isRequired,
    autoClosing: PropTypes.bool,
    children: PropTypes.node,
    daoStatus: DaoStatusType.isRequired,
    opened: PropTypes.bool,
    onClearActivities: PropTypes.func.isRequired,
    onMarkActivitiesRead: PropTypes.func.isRequired,
    onMenuPanelClose: PropTypes.func.isRequired,
    onMenuPanelOpen: PropTypes.func.isRequired,
    onRequestEnable: PropTypes.func.isRequired,
    unreadActivityCount: PropTypes.number,
  }

  state = {
    animate: false,
    activityOpened: false,
  }

  _animateTimer = -1
  _activityToggle = React.createRef()

  componentDidMount() {
    this.setState({ animate: this.props.autoClosing })
  }
  componentDidUpdate(prevProps) {
    this.updateAnimate(prevProps)
  }
  componentWillUnmount() {
    clearTimeout(this._animateTimer)
  }

  updateAnimate(prevProps) {
    if (prevProps.autoClosing === this.props.autoClosing) {
      return
    }

    // If autoClosing has changed, it means we are switching from autoClosing
    // to fixed or the opposite, and we should stop animating the panel for a
    // short period of time.
    this.setState({ animate: false })
    this._animateTimer = setTimeout(() => {
      this.setState({ animate: true })
    }, 0)
  }

  toggleActivity() {
    this.setState(
      ({ activityOpened }) => ({ activityOpened: !activityOpened }),
      () => {
        // mark as read after closing
        if (!this.state.activityOpened) {
          this.props.onMarkActivitiesRead()
        }
      }
    )
  }

  closeActivity() {
    this.setState({ activityOpened: false })
    this.props.onMarkActivitiesRead()
  }

  handleActivityClose = () => {
    this.closeActivity()
  }

  handleActivityButtonClick = () => {
    this.toggleActivity()
  }

  // Don’t close the activity panel if its toggle button is being focused.
  shouldCloseActivityPanel = ({ focusedElement }) => {
    return !this._activityToggle.current.contains(focusedElement)
  }

  render() {
    const { animate, activityOpened } = this.state
    const {
      account,
      apps,
      autoClosing,
      children,
      onClearActivities,
      onMenuPanelClose,
      onMenuPanelOpen,
      onRequestEnable,
      opened,
      ...props
    } = this.props

    return (
      <SwipeContainer
        autoClosing={autoClosing}
        onClose={onMenuPanelClose}
        onOpen={onMenuPanelOpen}
        opened={opened}
      >
        {swipeProgress => (
          <Spring
            from={{
              activityPanelProgress: 0,
              combinedPanelProgress: 0,
            }}
            to={{
              activityPanelProgress: Number(activityOpened),
              combinedPanelProgress: swipeProgress,
            }}
            config={springs.lazy}
            native
          >
            {({ activityPanelProgress, combinedPanelProgress }) => {
              const menuPanelValue =
                autoClosing && activityOpened ? 0 : swipeProgress
              return (
                <React.Fragment>
                  <Spring
                    from={{
                      menuPanelProgress: menuPanelValue,
                      overlayProgress: swipeProgress,
                    }}
                    to={{
                      menuPanelProgress: menuPanelValue,
                      overlayProgress: swipeProgress,
                    }}
                    config={springs.lazy}
                    immediate={!animate}
                    native
                  >
                    {({ menuPanelProgress, overlayProgress }) => (
                      <React.Fragment>
                        <Wrap
                          style={{
                            position: autoClosing ? 'absolute' : 'relative',
                            zIndex: '4',
                            pointerEvents:
                              swipeProgress === 1 ? 'auto' : 'none',
                            transform: menuPanelProgress.interpolate(
                              v =>
                                `translate3d(
                                  ${lerp(
                                    v,
                                    -(MENU_PANEL_WIDTH + MENU_PANEL_SHADOW_WIDTH),
                                    0
                                  )}px, 0, 0)`
                            ),
                          }}
                        >
                          <Viewport>
                            {({ height }) => (
                              <MenuPanel
                                account={account}
                                activityToggleRef={this._activityToggle}
                                onActivityButtonClick={
                                  this.handleActivityButtonClick
                                }
                                onRequestEnable={onRequestEnable}
                                viewportHeight={height}
                                {...props}
                              />
                            )}
                          </Viewport>
                        </Wrap>
                        {autoClosing && (
                          <Overlay
                            onClick={onMenuPanelClose}
                            style={{
                              zIndex: '2',
                              /* by leaving a 1px edge Android users can swipe to open
                               * from the edge of their screen when an iframe app is being
                               * used */
                              width: overlayProgress.interpolate(p =>
                                p === 0 ? '1px' : '100vw'
                              ),
                              opacity: overlayProgress,
                            }}
                          />
                        )}
                      </React.Fragment>
                    )}
                  </Spring>
                  <animated.div
                    style={{
                      position: 'absolute',
                      zIndex: '3',
                      top: '0',
                      left: '0',
                      width: `${ACTIVITY_PANEL_WIDTH}px`,
                      height: '100%',
                      transform: activityPanelProgress.interpolate(
                        v =>
                          `translate3d(${
                            autoClosing
                              ? lerp(
                                  v,
                                  -(
                                    ACTIVITY_PANEL_WIDTH +
                                    ACTIVITY_PANEL_SHADOW_WIDTH
                                  ),
                                  0
                                )
                              : lerp(
                                  v,
                                  -(
                                    ACTIVITY_PANEL_WIDTH -
                                    MENU_PANEL_WIDTH +
                                    ACTIVITY_PANEL_SHADOW_WIDTH
                                  ),
                                  MENU_PANEL_WIDTH
                                )
                          }px, 0, 0)`
                      ),
                    }}
                  >
                    <ActivityPanel
                      apps={apps}
                      displayBackButton={autoClosing}
                      onClearAll={onClearActivities}
                      onClose={this.handleActivityClose}
                      open={activityOpened}
                      shouldClose={this.shouldCloseActivityPanel}
                    />
                  </animated.div>
                  {children}
                </React.Fragment>
              )
            }}
          </Spring>
        )}
      </SwipeContainer>
    )
  }
}

const Overlay = styled(animated.div)`
  position: absolute;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
`

const Wrap = styled(animated.div)`
  width: ${MENU_PANEL_WIDTH}px;
  height: 100%;
  flex: none;
`

export default props => {
  const {
    unreadActivityCount,
    clearActivities,
    markActivitiesRead,
  } = useContext(ActivityContext)

  const requestClearActivities = useCallback(() => {
    clearActivities()
  }, [clearActivities])

  const requestMarkActivitiesRead = useCallback(() => {
    markActivitiesRead()
  }, [markActivitiesRead])

  return (
    <CombinedPanel
      {...props}
      unreadActivityCount={unreadActivityCount}
      onClearActivities={requestClearActivities}
      onMarkActivitiesRead={requestMarkActivitiesRead}
    />
  )
}
