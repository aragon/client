import React from 'react'
import { differenceInMinutes } from 'date-fns'

export default class TimeTag extends React.Component {
  state = { time: new Date() }
  componentDidMount() {
    this.interval = setInterval(() => this.forceUpdate(), 1000)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }
  render() {
    const time = differenceInMinutes(new Date(), this.state.time)
    return (
      <span style={this.props.style} ref={this.viewRef}>
        {time}m ago
      </span>
    )
  }
}
