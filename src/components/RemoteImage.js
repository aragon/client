import React from 'react'
import memoize from 'memoize-one'
import { noop } from '../utils'

// Tries to load an image, while displaying an alternative.
// Use `children` or `render` to render its children.
class RemoteImage extends React.Component {
  static defaultProps = {
    src: '',

    render: null, // render is an alias of children and takes priority
    children: noop,
  }
  state = { exists: false }

  updateSrc = memoize(src => {
    this.setState(() => {
      this._img = new Image()
      this._img.onload = () => {
        this.setState({ exists: true })
      }
      this._img.src = src

      return { exists: false }
    })
  })

  render() {
    const { exists } = this.state
    const { src, render, children } = this.props

    // memoized, safe to be called here
    this.updateSrc(src)

    return (render || children)({ exists })
  }
}

export default RemoteImage
