import React from 'react'
import PropTypes from 'prop-types'
import { noop } from '../utils'

// Tries to load an image, while displaying an alternative.
// Use `children` or `render` to render its children.
class RemoteImage extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    render: PropTypes.func,
    src: PropTypes.string.isRequired,
  }

  static defaultProps = {
    src: '',
    render: null, // render is an alias of children and takes priority
    children: noop,
  }

  state = { exists: false, loading: false }

  componentDidMount() {
    this.startLoading()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.src !== this.props.src) {
      this.startLoading()
    }
  }

  componentWillUnmount() {
    this.stopLoading()
  }

  startLoading() {
    const { src } = this.props
    this.stopLoading()
    this.setState(() => {
      this._img = new Image()
      this._img.addEventListener('load', this.handleLoad)
      this._img.src = src
      return { exists: false, loading: true }
    })
  }

  stopLoading() {
    this.setState({ loading: false })
    if (this._img) {
      this._img.removeEventListener('load', this.handleLoad)
      this._img = null
    }
  }

  handleLoad = () => {
    this.stopLoading() // no need to keep the image around
    this.setState({ exists: true })
  }

  render() {
    const { exists, loading } = this.state
    const { render, children } = this.props
    return (render || children)({ exists, loading })
  }
}

export default RemoteImage
