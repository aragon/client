import React from 'react'
import PropTypes from 'prop-types'
import { noop } from '../../utils'

class EscapeOutside extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    onEscapeOutside: PropTypes.func,
  }

  static defaultProps = {
    onEscapeOutside: noop,
  }

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
    if (!this.node.contains(e.target)) {
      onEscapeOutside()
    }
  }

  handleEscape = e => {
    const { onEscapeOutside } = this.props
    if (e.keyCode === 27) {
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
