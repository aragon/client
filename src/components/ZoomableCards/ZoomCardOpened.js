import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Transition, animated } from 'react-spring'
import { Viewport, springs } from '@aragon/ui'
import { lerp } from '../../math-utils'
import { RenderFnType } from '../../prop-types'

const LARGE_MARGIN = 30
const SIDEBAR_WIDTH = 360

class ZoomCardOpened extends React.Component {
  static propTypes = {
    cardRect: PropTypes.instanceOf(DOMRect),
    renderContent: PropTypes.func.isRequired,
    renderAside: RenderFnType,
    currentId: PropTypes.string,
  }

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
        <Viewport>
          {({ below }) => {
            const fullscreen = below('medium')
            const margin = fullscreen ? 0 : LARGE_MARGIN
            return (
              <div
                css={`
                  display: flex;
                  padding: ${fullscreen ? 20 : LARGE_MARGIN}px ${margin}px;
                `}
              >
                <div
                  ref={this._openedCard}
                  css={`
                    position: relative;
                    display: flex;
                    width: calc(
                      100% - ${renderAside ? SIDEBAR_WIDTH - margin : 0}px
                    );
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
                          fullscreen={fullscreen || undefined}
                          style={{
                            opacity: openProgress.interpolate(v =>
                              Math.min(1, v * 2)
                            ),
                            transformOrigin: '0 0',
                            transform: openProgress.interpolate(
                              this.getTransform
                            ),
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
                      <Aside margin={margin}>
                        <animated.div
                          style={{
                            padding: `0 ${margin}px 0 0`,
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
            )
          }}
        </Viewport>
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
  border: 1px solid rgba(209, 209, 209, 0.5);
  border-width: ${p => (p.fullscreen ? '1px 0' : '1px')};
  border-radius: ${p => (p.fullscreen ? '0' : '3px')};
  background: #ffffff;
`

const Aside = styled.aside`
  flex-shrink: 0;
  overflow: hidden;
  width: ${p => SIDEBAR_WIDTH - p.margin}px;
  margin-left: ${p => p.margin}px;
`

export default ZoomCardOpened
