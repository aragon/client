import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Gesture } from 'react-with-gesture'

const THRESHOLD_VERTICAL_TOLERANCE = 10
const THRESHOLD_DIRECTION = 0.2
const THRESHOLD_PROGRESS = 0.5
const MENU_WIDTH = 220

class SwipeContainer extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    enabled: PropTypes.bool.isRequired,
    menuPanelOpened: PropTypes.bool.isRequired,
    onMenuPanelClose: PropTypes.func.isRequired,
    onMenuPanelOpen: PropTypes.func.isRequired,
  }

  _previousProgress = 0

  render() {
    const {
      children,
      enabled,
      menuPanelOpened,
      onMenuPanelClose,
      onMenuPanelOpen,
    } = this.props

    const xThreshold = MENU_WIDTH / 3

    return (
      <Gesture passive={{ passive: false }} mouse={false} touch={enabled}>
        {({
          delta: [xDelta, yDelta],
          direction: [xDir, yDir],
          down,
          event,
          initial: [xInitial],
          xy: [x],
        }) => {
          if (!enabled) {
            return <Container>{children(Number(menuPanelOpened))}</Container>
          }

          if (
            !down &&
            this._previousProgress > 0 &&
            this._previousProgress < 1
          ) {
            this._previousProgress = Number(
              this._previousProgress > THRESHOLD_PROGRESS
            )
            setTimeout(
              this._previousProgress
                ? () => {
                    // reset for menu buttons to work
                    this._previousProgress = 0
                    onMenuPanelOpen()
                  }
                : onMenuPanelClose,
              0
            )
            return <Container>{children(this._previousProgress)}</Container>
          }

          let progress = this._previousProgress || Number(menuPanelOpened)

          if (
            (progress > 0 && progress < 1) ||
            (down &&
              xDelta !== 0 &&
              yDelta > -THRESHOLD_VERTICAL_TOLERANCE &&
              yDelta < THRESHOLD_VERTICAL_TOLERANCE &&
              xDir !== 0 &&
              yDir > -THRESHOLD_DIRECTION &&
              yDir < THRESHOLD_DIRECTION)
          ) {
            event.preventDefault()
            if (xDelta > 0 && !menuPanelOpened && xInitial < xThreshold) {
              // opening
              progress = this._previousProgress = x / MENU_WIDTH
            } else if (menuPanelOpened) {
              // closing
              progress = this._previousProgress = 1 + xDelta / MENU_WIDTH
            }
            progress = this._previousProgress = Math.max(
              0.000001,
              Math.min(0.999999, progress)
            )
          }
          return <Container>{children(progress)}</Container>
        }}
      </Gesture>
    )
  }
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
  min-height: 0;
`

export default SwipeContainer
