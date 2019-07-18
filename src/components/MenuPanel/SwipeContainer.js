import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Gesture } from 'react-with-gesture'
import { MENU_PANEL_WIDTH } from './MenuPanel'

const THRESHOLD_VERTICAL_TOLERANCE = 10
const THRESHOLD_DIRECTION = 0.2
const THRESHOLD_PROGRESS = 0.5
const GRAB_THRESHOLD = MENU_PANEL_WIDTH / 3

class SwipeContainer extends React.Component {
  static propTypes = {
    autoClosing: PropTypes.bool.isRequired,
    children: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
    opened: PropTypes.bool.isRequired,
  }

  _previousProgress = 0

  render() {
    const { autoClosing, children, onClose, onOpen, opened } = this.props

    return (
      <Gesture passive={{ passive: false }} mouse={false} touch={autoClosing}>
        {({
          delta: [xDelta, yDelta],
          direction: [xDir, yDir],
          down,
          event,
          initial: [xInitial],
          xy: [x],
        }) => {
          if (!autoClosing) {
            return <Container>{children(Number(opened))}</Container>
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
                    onOpen()
                  }
                : onClose,
              0
            )
            return <Container>{children(this._previousProgress)}</Container>
          }

          let progress = this._previousProgress || Number(opened)

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

            if (xDelta > 0 && !opened && xInitial < GRAB_THRESHOLD) {
              // opening
              progress = this._previousProgress = x / MENU_PANEL_WIDTH
            } else if (opened) {
              // closing
              progress = this._previousProgress = 1 + xDelta / MENU_PANEL_WIDTH
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
  height: 100%;
`

export default SwipeContainer
