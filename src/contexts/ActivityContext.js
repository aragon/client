import React from 'react'
import PropTypes from 'prop-types'
import StoredList from '../StoredList'
import { network } from '../environment'

const ActivityContext = React.createContext()
const ActivityConsumer = ActivityContext.Consumer

const storedList = new StoredList(`activity:${network.type}`)

// Provides easy access to the user activities list
class ActivityProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  }

  state = {
    activities: storedList.loadItems(),
  }

  add = activity => {
    this.setState({
      activities: storedList.add(activity),
    })
  }

  remove = index => {
    this.setState({
      activities: storedList.remove(index),
    })
  }

  updateActivities = activities => {
    this.setState({
      activities: storedList.update(activities),
    })
  }

  render() {
    const { children } = this.props
    const { activities } = this.state
    return (
      <ActivityContext.Provider
        value={{
          activities,
          updateActivities: this.updateActivities,
        }}
      >
        {children}
      </ActivityContext.Provider>
    )
  }
}

export { ActivityContext, ActivityProvider, ActivityConsumer }
