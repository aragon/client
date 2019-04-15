import React from 'react'
import PropTypes from 'prop-types'
import StoredList from '../StoredList'
import { network } from '../environment'
import { EthereumAddressType } from '../prop-types'

const ActivityContext = React.createContext()

const activityStatusTypes = {
  CONFIRMED: 'CONFIRMED',
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  TIMED_OUT: 'TIMED_OUT',
}

const activityTypes = {
  TRANSACTION: 'TRANSACTION',
}

const TEN_MINUTES = 1000 * 60 * 10

const getStoredList = (daoDomain, account) =>
  new StoredList(`activity:${network.type}:${daoDomain}:${account}`)

// Provides easy access to the user activities list
class ActivityProvider extends React.Component {
  static propTypes = {
    account: EthereumAddressType, // Current wallet
    children: PropTypes.node,
    daoDomain: PropTypes.string, // domain of current DAO
    web3: PropTypes.object,
  }
  static defaultProps = {
    account: '',
  }

  state = {
    // activities of all accounts
    activities: [],
  }

  _storedList = null

  componentDidMount() {
    this.updateStoredList()
  }

  componentDidUpdate(prevProps) {
    const { daoDomain, account } = this.props
    if (daoDomain !== prevProps.daoDomain || account !== prevProps.account) {
      this.updateStoredList()
    }
  }

  updateStoredList() {
    const { daoDomain, account } = this.props
    this._storedList = getStoredList(daoDomain, account)
    this.setState(
      { activities: this._storedList.getItems() },
      this.refreshPendingActivities
    )
  }

  componentWillMount() {
    this._checkInterval = setInterval(this.checkForTimedOut, 1000 * 30)
  }

  componentWillUnmount() {
    clearInterval(this._checkInterval)
  }

  // Refresh the status of pending activities
  refreshPendingActivities() {
    const { web3 } = this.props

    this.state.activities
      .filter(({ status }) => status === activityStatusTypes.PENDING)
      .forEach(async ({ transactionHash }) => {
        try {
          const tx = await web3.eth.getTransaction(`${transactionHash}`)
          // tx is null if no tx was found
          if (tx && tx.blockNumber) {
            this.setActivityConfirmed(transactionHash)
          }
        } catch (e) {
          console.error(`Failed to refresh transaction ${transactionHash}`)
        }
      })
  }

  checkForTimedOut = () => {
    const now = Date.now()
    this.state.activities.forEach(activity => {
      const timeDelta = now - activity.createdAt
      if (
        timeDelta > TEN_MINUTES &&
        activity.status === activityStatusTypes.PENDING
      ) {
        // Set pending items to timed out after 10 minutes
        this.setActivityTimedOut(activity.transactionHash)
      }
    })
  }

  add = activity => {
    this.setState({
      activities: this._storedList.add(activity),
    })
  }

  addTransactionActivity = ({
    transactionHash = '',
    from = '',
    targetAppProxyAddress = '',
    forwarder = '',
    forwarderProxyAddress = '',
    description = '',
  } = {}) => {
    const newActivity = {
      createdAt: Date.now(),
      type: activityTypes.TRANSACTION,
      status: activityStatusTypes.PENDING,
      read: false,
      transactionHash,
      // account address from which the transaction was created
      from,
      targetAppProxyAddress,
      forwarderProxyAddress,
      forwarder,
      description,
    }

    const updatedActivities = this._storedList.add(newActivity)

    this.setState({ activities: updatedActivities })
  }

  currentAccountPredicate = ({ from }) =>
    from.toLowerCase() === this.props.account.toLowerCase()

  remove = index => {
    this.setState({
      activities: this._storedList.remove(index),
    })
  }

  updateActivities = activities => {
    this.setState({
      activities: this._storedList.update(activities),
    })
  }

  filterActivities = (predicate = activity => true) => {
    const filtered = this.state.activities.filter(predicate)

    this.setState({
      activities: this._storedList.update(filtered),
    })
  }

  clearActivities = () => {
    // Clear all non pending activities
    // (we don't clear pending because we're awaiting state change)
    this.filterActivities(
      ({ status, from }) => status === activityStatusTypes.PENDING
    )
  }

  clearActivity = transactionHash => {
    this.filterActivities(
      activity => activity.transactionHash !== transactionHash
    )
  }

  markActivitiesRead = () => {
    // Mark the current user's activities as read
    const readActivities = this.state.activities.map(activity => ({
      ...activity,
      read: true,
    }))

    this.setState({
      activities: this._storedList.update(readActivities),
    })
  }

  // update activity status and set the activity to unread
  setActivityStatus = status => transactionHash => {
    const activities = this.state.activities.map(activity =>
      activity.transactionHash === transactionHash
        ? {
            ...activity,
            read: false,
            status,
          }
        : activity
    )

    this.setState({
      activities: this._storedList.update(activities),
    })
  }

  setActivityConfirmed = this.setActivityStatus(activityStatusTypes.CONFIRMED)
  setActivityFailed = this.setActivityStatus(activityStatusTypes.FAILED)
  setActivityTimedOut = this.setActivityStatus(activityStatusTypes.TIMED_OUT)

  setActivityNonce = ({ transactionHash, nonce }) => {
    const activities = this.state.activities.map(activity =>
      activity.transactionHash === transactionHash
        ? {
            ...activity,
            nonce,
          }
        : activity
    )

    this.setState({
      activities: this._storedList.update(activities),
    })
  }

  getUnreadActivityCount = () =>
    this.state.activities.reduce(
      (count, { read }) => (read ? count : count + 1),
      0
    )

  render() {
    const { children } = this.props
    const unreadActivityCount = this.getUnreadActivityCount()

    return (
      <ActivityContext.Provider
        value={{
          unreadActivityCount,
          activities: this.state.activities,
          addTransactionActivity: this.addTransactionActivity,
          clearActivities: this.clearActivities,
          setActivityConfirmed: this.setActivityConfirmed,
          setActivityFailed: this.setActivityFailed,
          clearActivity: this.clearActivity,
          updateActivities: this.updateActivities,
          markActivitiesRead: this.markActivitiesRead,
          setActivityNonce: this.setActivityNonce,
        }}
      >
        {children}
      </ActivityContext.Provider>
    )
  }
}

const ActivityConsumer = ActivityContext.Consumer

export {
  activityStatusTypes,
  ActivityContext,
  ActivityProvider,
  ActivityConsumer,
}
