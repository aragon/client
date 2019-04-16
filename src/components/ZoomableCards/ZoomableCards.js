import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Spring, animated } from 'react-spring'
import { springs } from '@aragon/ui'
import { RenderFnType } from '../../prop-types'
import ZoomCard from './ZoomCard'
import ZoomCardOpened from './ZoomCardOpened'

class ZoomableCards extends React.PureComponent {
  static propTypes = {
    currentId: PropTypes.string,
    renderCards: PropTypes.func.isRequired,
    renderOpenedCard: PropTypes.func.isRequired,
    renderOpenedAside: RenderFnType,
  }
  static defaultProps = {
    currentId: null,
  }

  state = {
    cardRect: null,
  }

  _cardRefs = new Map()

  addCard = (id, element) => {
    this._cardRefs.set(id, element)
  }
  removeCard = id => {
    this._cardRefs.delete(id)
  }
  componentDidUpdate(prevProps) {
    const { currentId } = this.props
    if (currentId !== prevProps.currentId) {
      this.updateCardId(currentId)
    }
  }
  updateCardId(currentId) {
    if (currentId === null) {
      this.setState({ cardRect: null })
      return
    }
    const card = this._cardRefs.get(currentId)
    if (card) {
      this.setState({
        cardRect: card.getBoundingClientRect(),
      })
    }
  }

  renderZoomCard = (id, children) => (
    <ZoomCard
      id={id}
      key={id}
      addRef={this.addCard}
      removeRef={this.removeCard}
    >
      {children}
    </ZoomCard>
  )

  render() {
    const {
      currentId,
      renderCards,
      renderOpenedCard,
      renderOpenedAside,
    } = this.props
    const { cardRect } = this.state
    return (
      <div>
        <Spring
          from={{ showProgress: 1 }}
          to={{ showProgress: Number(currentId === null) }}
          config={springs.smooth}
          initial={null}
          native
        >
          {({ showProgress }) => (
            <ScrollView style={{ opacity: showProgress }}>
              <div
                css={`
                  padding: 30px;
                `}
              >
                {renderCards({ card: this.renderZoomCard })}
              </div>
            </ScrollView>
          )}
        </Spring>
        <ZoomCardOpened
          currentId={currentId}
          renderContent={renderOpenedCard}
          renderAside={renderOpenedAside}
          cardRect={cardRect}
        />
      </div>
    )
  }
}

const ScrollView = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  will-change: opacity;
`

export default ZoomableCards
