import React from 'react'
import PropTypes from 'prop-types'
import { Spring, animated } from 'react-spring'
import { springs } from '@aragon/ui'
import ZoomCard from './ZoomCard'
import ZoomCardOpened from './ZoomCardOpened'

const { Provider, Consumer } = React.createContext({})

class ZoomableCards extends React.Component {
  static propTypes = {
    currentId: PropTypes.string,
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
  render() {
    const {
      currentId,
      renderCards,
      renderOpenedCard,
      renderOpenedAside,
    } = this.props
    const { cardRect } = this.state
    const { addCard, removeCard } = this
    return (
      <React.Fragment>
        <Spring
          from={{ showProgress: 1 }}
          to={{ showProgress: Number(currentId === null) }}
          config={springs.smooth}
          native
        >
          {({ showProgress }) => (
            <animated.div style={{ opacity: showProgress }}>
              {renderCards({
                card: (id, children) => (
                  <ZoomCard
                    id={id}
                    key={id}
                    addRef={addCard}
                    removeRef={removeCard}
                  >
                    {children}
                  </ZoomCard>
                ),
              })}
            </animated.div>
          )}
        </Spring>
        <ZoomCardOpened
          currentId={currentId}
          renderContent={renderOpenedCard}
          renderAside={renderOpenedAside}
          cardRect={cardRect}
        />
      </React.Fragment>
    )
  }
}

export default ZoomableCards
