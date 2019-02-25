import React from 'react'
import PropTypes from 'prop-types'

// Implements a behavior similar to :focus-visible for browsers that are not
// supporting it yet.
//
// It follows the Chrome implementation, checking for a pointer device rather
// than a keyboard event.
//
// Resources:
//  - https://caniuse.com/#search=%3Afocus-visible
//  - https://github.com/WICG/focus-visible/issues/88#issuecomment-363227219
//  - https://chromium-review.googlesource.com/c/chromium/src/+/897002<Paste>
//
class FocusVisible extends React.PureComponent {
  static propTypes = {
    // children is called with an object containing two entries:
    //   - focusVisible represents the visibility of the focus (boolean).
    //   - onFocus() need to be called when the target element is focused.
    children: PropTypes.func.isRequired,
  }
  _element = React.createRef()
  state = {
    focusVisible: false,
  }
  componentDidMount() {
    const doc = this._element.current.ownerDocument
    doc.addEventListener('mousedown', this.handlePointerEvent)
    doc.addEventListener('mouseup', this.handlePointerEvent)
    doc.addEventListener('touchstart', this.handlePointerEvent)
    doc.addEventListener('touchend', this.handlePointerEvent)
  }
  componentWillUnmount() {
    const doc = this._element.current.ownerDocument
    doc.removeEventListener('mousedown', this.handlePointerEvent)
    doc.removeEventListener('mouseup', this.handlePointerEvent)
    doc.removeEventListener('touchstart', this.handlePointerEvent)
    doc.removeEventListener('touchend', this.handlePointerEvent)
  }
  // It doesn’t seem to be specified, but pointer events happen before focus
  // events on modern browsers.
  handlePointerEvent = e => {
    this._pointerActive = true
    this._timer = setTimeout(() => {
      this._pointerActive = false
    }, 0)
    this.setState({ focusVisible: false })
  }
  // This is passed to `children()`, and called from the outside.
  handleFocus = () => {
    this.setState({ focusVisible: !this._pointerActive })
  }
  render() {
    const { focusVisible } = this.state
    return (
      <React.Fragment>
        {this.props.children({ focusVisible, onFocus: this.handleFocus })}
        <span ref={this._element} />
      </React.Fragment>
    )
  }
}

export default FocusVisible
