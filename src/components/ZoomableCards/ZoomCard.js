import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

class ZoomCard extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    addRef: PropTypes.func,
    removeRef: PropTypes.func,
  }
  _element = React.createRef()
  componentDidMount() {
    this.props.addRef(this.props.id, this._element.current)
  }
  componentWillUnmount() {
    this.props.removeRef(this.props.id)
  }
  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.props.removeRef(prevProps.id)
      this.props.addRef(this.props.id, this._element.current)
    }
  }
  render() {
    return (
      <div
        ref={this._element}
        css={`
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 20px 30px;
          background: #ffffff;
          border: 1px solid rgba(209, 209, 209, 0.5);
          border-radius: 3px;
        `}
        {...this.props}
      />
    )
  }
}

export default ZoomCard
