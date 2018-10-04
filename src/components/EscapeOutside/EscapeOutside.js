import React, { Component } from 'react'

class EscapeOutside extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.onEscape)
    document.addEventListener('click', this.onClick, true)
    document.addEventListener('touchend', this.onClick, true)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onEscape)
    document.removeEventListener('click', this.onClick, true)
    document.removeEventListener('touchend', this.onClick, true)
  }

  render() {
    const { children, onEscapeOutside, ...rest } = this.props

    return (
      <div {...rest} ref={n => (this.node = n)}>
        {children}
      </div>
    )
  }

  onEscape = e => {
    const { onEscapeOutside } = this.props
    if (e.keyCode === 27 && onEscapeOutside) {
      onEscapeOutside()
    }
  }

  onClick = e => {
    const { onEscapeOutside } = this.props
    if (!this.node.contains(e.target) && onEscapeOutside) {
      onEscapeOutside()
    }
  }
}

export default EscapeOutside
