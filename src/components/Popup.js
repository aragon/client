import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Transition, animated } from 'react-spring'
import { Card } from '@aragon/ui'
import { noop } from '../utils'
import springs from '../springs'

export const TRANSITION_SCALE_DIFF = 0.04
export const TRANSITION_SPRING = { ...springs.swift, precision: 0.1 }

class Popup extends React.Component {
  static propTypes = {
    onRequestClose: PropTypes.func,
    children: PropTypes.node,
  }
  static defaultProps = {
    onRequestClose: noop,
  }

  state = { previouslyFocusedElement: null }

  _element = React.createRef()

  _closeRequested = false

  componentDidMount() {
    this.attachEvents()

    this.setState({ previouslyFocusedElement: document.activeElement })
    this._element.current.focus()
  }

  componentWillUnmount() {
    this.removeEvents()
  }

  attachEvents() {
    this._element.current.addEventListener('focusout', this.handleFocusout)
    document.addEventListener('keydown', this.handleKeydown)
  }

  removeEvents() {
    this._element.current.removeEventListener('focusout', this.handleFocusout)
    document.removeEventListener('keydown', this.handleKeydown)
  }

  close() {
    if (this._closeRequested) {
      return
    }

    const { onRequestClose } = this.props
    const { previouslyFocusedElement } = this.state
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus()
    }

    // We can’t reliably know if the element previously focused can actually
    // receive focus or if it was implicitly focused. That’s why we explicitly
    // call onRequestClose() even if `previouslyFocusedElement.focus()` should
    // trigger `this.handleFocusout()` and call this method again.
    // The `_closeRequested` flag prevents `onRequestClose` to be called twice.
    onRequestClose()
    this._closeRequested = true
  }

  handleKeydown = event => {
    if (event.keyCode === 27) {
      this.close()
    }
  }

  handleFocusout = event => {
    const popupElement = this._element.current
    const focusedElement = event.relatedTarget
    if (!popupElement.contains(focusedElement)) {
      this.close()
    }
  }

  render() {
    const { children } = this.props
    return (
      <Main tabIndex="0" ref={this._element}>
        {children}
      </Main>
    )
  }
}

class AnimatedPopup extends React.Component {
  static propTypes = {
    visible: PropTypes.func,
  }
  static defaultProps = {
    visible: true,
  }
  render() {
    const { visible, ...props } = this.props
    return (
      <Transition
        items={visible}
        from={{ visibleProgress: 0 }}
        enter={{ visibleProgress: 1 }}
        leave={{ visibleProgress: 0 }}
        config={TRANSITION_SPRING}
        native
      >
        {(visible = true) =>
          visible &&
          (({ visibleProgress }) => (
            <PopupWrapper
              style={{
                opacity: visibleProgress,
                transform: visibleProgress.interpolate(
                  v =>
                    `scale(
                      ${1 - TRANSITION_SCALE_DIFF + TRANSITION_SCALE_DIFF * v}
                    )`
                ),
              }}
            >
              <Popup {...props} />
            </PopupWrapper>
          ))
        }
      </Transition>
    )
  }
}

const Main = styled(Card)`
  display: flex;
  width: auto;
  height: auto;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.03);
  padding: 10px 0;
  &:focus {
    outline: 0;
  }
`

const PopupWrapper = styled(animated.div)`
  position: absolute;
  z-index: 3;
  top: 10px;
  left: 10px;
`

export default AnimatedPopup
