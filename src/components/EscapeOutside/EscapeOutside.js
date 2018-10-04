import React from 'react'

class EscapeOutside extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleEscape)
    document.addEventListener('click', this.handleClick, true)
    document.addEventListener('touchend', this.handleClick, true)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscape)
    document.removeEventListener('click', this.handleClick, true)
    document.removeEventListener('touchend', this.handleClick, true)
  }

  handleClick = e => {
    const { onEscapeOutside } = this.props
    if (!this.node.contains(e.target) && onEscapeOutside) {
      onEscapeOutside()
    }
  }

  handleEscape = e => {
    const { onEscapeOutside } = this.props
    if (e.keyCode === 27 && onEscapeOutside) {
      onEscapeOutside()
    }
  }

  render() {
    const { children, onEscapeOutside, ...rest } = this.props

    return (
      <div {...rest} ref={n => (this.node = n)}>
        {children}
      </div>
    )
  }
}

export default EscapeOutside
