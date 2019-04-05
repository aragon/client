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

const activityTypes = {
  TRANSACTION: 'TRANSACTION',
}

storedList.update([
  {
    createdAt: 1554471557853,
    read: false,
    from: '0x3bDBLLATEST',
    status: activityStatusTypes.CONFIRMED,
    type: activityTypes.TRANSACTION,
    initiatingApp: 'Token Manager',
    forwarder: 'Voting',
    description: 'Mint 1 tokens for 0x3bDBLLA',
    transactionHash:
      '0x873c90026744e293f12c40a5fc6cf3b7bb368636f0dea632da50348719f96cce',
  },
])

// {
//   id: '2',
//   status: activityStatusTypes.FAILED,
//   type: '',
//   title: '',
//   content: 'Assign 1 tokens to 0x1234...',
// },

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

  addTransactionActivity = ({
    transactionHash = '',
    from = '',
    initiatingApp = '',
    forwarder = '',
    description = '',
  } = {}) => {
    const newActivity = {
      createdAt: Date.now(),
      type: activityTypes.TRANSACTION,
      read: false,
      transactionHash,
      from,
      initiatingApp,
      forwarder,
      description,
    }

    const updatedActivities = storedList.add(newActivity)

    this.setState({ activities: updatedActivities })
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
      ({ status }) => status === activityStatusTypes.PENDING
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
          addTransactionActivity: this.addTransactionActivity,
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
