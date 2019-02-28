import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Gesture } from 'react-with-gesture'
import { Viewport } from '@aragon/ui'

const THRESHOLD_VERTICAL_TOLERANCE = 10
const THRESHOLD_DIRECTION = 0.2
const THRESHOLD_PROGRESS = 0.5

class SwipeContainer extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    enabled: PropTypes.bool.isRequired,
    menuPanelOpened: PropTypes.bool.isRequired,
    onMenuPanelClose: PropTypes.func.isRequired,
    onMenuPanelOpen: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
  }

  _previousProgress = 0

  render() {
    const {
      children,
      enabled,
      menuPanelOpened,
      onMenuPanelClose,
      onMenuPanelOpen,
      width,
    } = this.props
    const oneThirdWindowWidth = width / 3

    if (!enabled) {
      return <Container>{children(Number(menuPanelOpened))}</Container>
    }

    return (
      <Gesture passive={{ passive: false }} mouse={false}>
        {({
          delta: [xDelta, yDelta],
          direction: [xDir, yDir],
          down,
          event,
          initial: [xInitial],
          xy: [x],
        }) => {
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
            if (
              xDelta > 0 &&
              !menuPanelOpened &&
              xInitial < oneThirdWindowWidth
            ) {
              // opening
              progress = this._previousProgress = x / (width * 0.9)
            } else if (menuPanelOpened) {
              // closing
              progress = this._previousProgress = 1 + xDelta / width
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

export default props => (
  <Viewport>
    {({ width }) => <SwipeContainer width={width} {...props} />}
  </Viewport>
)
