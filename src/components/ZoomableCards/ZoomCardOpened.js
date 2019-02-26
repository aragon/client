import React from 'react'
import styled from 'styled-components'
import { Transition, animated } from 'react-spring'
import { springs } from '@aragon/ui'

function lerp(progress, value1, value2) {
  return (value2 - value1) * progress + value1
}

const MARGIN = 30
const SIDEBAR_WIDTH = 360

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

    const from = cardRect
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
      <ScrollView
        css={`
          pointer-events: ${currentId === null ? 'none' : 'auto'};
        `}
      >
        <div
          css={`
            display: flex;
            padding: ${MARGIN}px;
          `}
        >
          <div
            ref={this._openedCard}
            css={`
              position: relative;
              display: flex;
              width: calc(100% - ${renderAside ? SIDEBAR_WIDTH - MARGIN : 0}px);
              flex-direction: column;
            `}
          >
            <Transition
              items={currentId}
              from={{ openProgress: 0 }}
              enter={{ openProgress: 1 }}
              leave={{ openProgress: 0 }}
              config={springs.smooth}
              initial={null}
              native
            >
              {currentId =>
                currentId !== null &&
                (({ openProgress }) => (
                  <Card
                    style={{
                      opacity: openProgress.interpolate(v =>
                        Math.min(1, v * 2)
                      ),
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
            initial={null}
            native
          >
            {currentId =>
              renderAside &&
              currentId !== null &&
              (({ openProgress }) => (
                <Aside>
                  <animated.div
                    style={{
                      padding: `0 ${MARGIN}px 0 0`,
                      opacity: openProgress,
                      transform: openProgress.interpolate(
                        v => `translate3d(${(1 - v) * 50}%, 0, 0)`
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
      </ScrollView>
    )
  }
}

const ScrollView = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
`

const Card = styled(animated.div)`
  background: #ffffff;
  border: 1px solid rgba(209, 209, 209, 0.5);
  border-radius: 3px;
`

const Aside = styled.aside`
  flex-shrink: 0;
  overflow: hidden;
  width: ${SIDEBAR_WIDTH - MARGIN}px;
  margin-left: ${MARGIN}px;
`

export default ZoomCardOpened
