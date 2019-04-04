import React from 'react'
import PropTypes from 'prop-types'
import StoredList from '../StoredList'
import { network } from '../environment'

const ActivityContext = React.createContext()

const storedList = new StoredList(`activity:${network.type}`)

const activityStatusTypes = {
  CONFIRMED: 'CONFIRMED',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  TIMED_OUT: 'TIMED_OUT',
}

storedList.update([
  {
    id: '1',
    status: activityStatusTypes.CONFIRMED,
    type: '',
    title: 'Vote #9 passed',
    content: 'A 100 ANT payment to 0xabcd... was executed',
  },
  {
    id: '2',
    status: activityStatusTypes.FAILED,
    type: '',
    title: '',
    content: 'Assign 1 tokens to 0x1234...',
  },
  {
    id: '3',
    status: '',
    type: 'transaction',
    title: 'Vote #11 created',
    content: 'Mint 100 ORG to 0x1234...',
  },
])

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

  clearAll = () => {
    // Clear all non pending activities (we don't clear because we're awaiting state change)
    const nonPendingActivities = this.state.activities.filter(
      ({ status }) => status !== activityStatusTypes.PENDING
    )

    this.setState({
      activities: storedList.update(nonPendingActivities),
    })
  }

  render() {
    const { children } = this.props
    const { activities } = this.state
    return (
      <ActivityContext.Provider
        value={{
          activities,
          add: this.add,
          clearAll: this.clearAll,
          updateActivities: this.updateActivities,
        }}
      >
        {children}
      </ActivityContext.Provider>
    )
  }
}

const ActivityConsumer = ActivityContext.Consumer
export { ActivityContext, ActivityProvider, ActivityConsumer }
