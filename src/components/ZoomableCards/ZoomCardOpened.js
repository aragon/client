import React from 'react'
import styled from 'styled-components'
import { Transition, animated } from 'react-spring'
import { springs } from '@aragon/ui'

function lerp(progress, value1, value2) {
  return (value2 - value1) * progress + value1
}

const MARGIN = 30
const SIDEBAR_WIDTH = 300

class ZoomCardOpened extends React.Component {
  state = {
    openedCardRect: null,
  }

  _openedCard = React.createRef()

  componentDidMount() {
    this.setState({ openedCardRect: this.getOpenedCardRect() })
  }

  componentDidUpdate(prevProps) {
    this.updateCardRect(prevProps.cardRect, this.props.cardRect)
  }

  updateCardRect(prevCardRect, cardRect) {
    if (!cardRect || cardRect === prevCardRect) {
      return
    }

    this.setState({ cardRect, openedCardRect: this.getOpenedCardRect() })

    this._openedCard.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  getOpenedCardRect() {
    return this._openedCard.current.getBoundingClientRect()
  }

  getTransform = t => {
    const { cardRect, openedCardRect } = this.state

    const to = openedCardRect
    if (!to) {
      return 'none'
    }

    const from = cardRect || {
      x: to.x + to.width / 4,
      y: to.y + to.y / 4,
      width: to.width / 2,
      height: to.height / 2,
    }
    if (!from) {
      return 'none'
    }

    return `
      translate3d(
        ${lerp(t, -to.x + from.x, 0)}px,
        ${lerp(t, -to.y + from.y, 0)}px,
        0
      )
      scale3d(
        ${lerp(t, from.width / to.width, 1)},
        ${lerp(t, from.height / to.height, 1)},
        1
      )
    `
  }
  render() {
    const { renderContent, renderAside, currentId } = this.props
    return (
      <div
        css={`
          position: absolute;
          top: ${MARGIN}px;
          left: ${MARGIN}px;
          right: ${MARGIN}px;
          display: flex;
        `}
      >
        <div
          ref={this._openedCard}
          css={`
            display: flex;
            flex-direction: column;
            width: 100%;
            position: relative;
          `}
        >
          <Transition
            items={currentId}
            from={{ openProgress: 0 }}
            enter={{ openProgress: 1 }}
            leave={{ openProgress: 0 }}
            config={springs.smooth}
            native
          >
            {currentId =>
              currentId !== null &&
              (({ openProgress }) => (
                <Card
                  style={{
                    opacity: openProgress.interpolate(v => Math.min(1, v * 2)),
                    transformOrigin: '0 0',
                    transform: openProgress.interpolate(this.getTransform),
                    background: 'white',
                  }}
                >
                  {renderContent({ openProgress, currentId })}
                </Card>
              ))
            }
          </Transition>
        </div>
        <Transition
          items={currentId}
          from={{ openProgress: 0 }}
          enter={{ openProgress: 1 }}
          leave={{ openProgress: 0 }}
          config={springs.smooth}
          delay={currentId !== null ? 150 : 0}
          native
        >
          {currentId =>
            renderAside &&
            currentId !== null &&
            (({ openProgress }) => (
              <Aside>
                <animated.div
                  style={{
                    padding: `0 ${MARGIN}px`,
                    transform: openProgress.interpolate(
                      v => `translate3d(${(1 - v) * 100}%, 0, 0)`
                    ),
                  }}
                >
                  {renderAside({ currentId })}
                </animated.div>
              </Aside>
            ))
          }
        </Transition>
      </div>
    )
  }
}

const Card = styled(animated.div)`
  padding: 20px 30px;
  background: #ffffff;
  border: 1px solid rgba(209, 209, 209, 0.5);
  border-radius: 3px;
`

const Aside = styled.aside`
  overflow: hidden;
  width: ${SIDEBAR_WIDTH}px;
  margin-right: -${MARGIN}px;
`

export default ZoomCardOpened
