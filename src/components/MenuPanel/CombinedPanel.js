import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { Viewport, springs } from '@aragon/ui'
import { AppType, AppsStatusType, DaoStatusType } from '../../prop-types'
import { lerp } from '../../math-utils'
import MenuPanel, {
  MENU_PANEL_WIDTH,
  MENU_PANEL_SHADOW_WIDTH,
} from './MenuPanel'

class CombinedPanel extends React.Component {
  static propTypes = {
    apps: PropTypes.arrayOf(AppType).isRequired,
    appsStatus: AppsStatusType.isRequired,
    autoClosing: PropTypes.bool,
    children: PropTypes.node,
    daoStatus: DaoStatusType.isRequired,
    opened: PropTypes.bool,
    onMenuPanelClose: PropTypes.func.isRequired,
    onMenuPanelOpen: PropTypes.func.isRequired,
  }

  state = {
    animate: false,
  }

  _animateTimer = -1

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

  render() {
    const { animate } = this.state

    const {
      apps,
      autoClosing,
      children,
      onMenuPanelClose,
      onMenuPanelOpen,
      opened,
      ...props
    } = this.props

    const menuPanelValue = 1 - Number(autoClosing)

    return (
      <React.Fragment>
        <Spring
          from={{ menuPanelProgress: menuPanelValue }}
          to={{ menuPanelProgress: menuPanelValue }}
          config={springs.lazy}
          immediate={!animate}
          native
        >
          {({ menuPanelProgress }) => (
            <React.Fragment>
              <Wrap
                style={{
                  position: autoClosing ? 'absolute' : 'relative',
                  zIndex: '4',
                  transform: menuPanelProgress.interpolate(
                    v =>
                      `translate3d(${lerp(
                        v,
                        -(MENU_PANEL_WIDTH + MENU_PANEL_SHADOW_WIDTH),
                        0
                      )}px, 0, 0)`
                  ),
                }}
              >
                <Viewport>
                  {({ height }) => (
                    <MenuPanel viewportHeight={height} {...props} />
                  )}
                </Viewport>
              </Wrap>
              {autoClosing && (
                <Overlay
                  onClick={onMenuPanelClose}
                  style={{
                    zIndex: '2',
                    width: '100%',
                    opacity: menuPanelProgress,
                  }}
                />
              )}
            </React.Fragment>
          )}
        </Spring>
        {children}
      </React.Fragment>
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

export default CombinedPanel
