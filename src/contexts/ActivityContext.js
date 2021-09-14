import React from 'react'
import PropTypes from 'prop-types'
import { useWallet } from '../contexts/wallet'
import StoredList from '../StoredList'
import { EthereumAddressType } from '../prop-types'
import {
  ACTIVITY_STATUS_CONFIRMED,
  ACTIVITY_STATUS_FAILED,
  ACTIVITY_STATUS_PENDING,
  ACTIVITY_STATUS_TIMED_OUT,
  ACTIVITY_TYPE_TRANSACTION,
} from '../symbols'
import { getLocalStorageKey } from '../util/utils'

const ActivityContext = React.createContext()

const TEN_MINUTES = 1000 * 60 * 10

// Only used to serialize / deserialize the symbols
const SymbolsByName = new Map(
  Object.entries({
    ACTIVITY_STATUS_CONFIRMED,
    ACTIVITY_STATUS_PENDING,
    ACTIVITY_STATUS_FAILED,
    ACTIVITY_STATUS_TIMED_OUT,
    ACTIVITY_TYPE_TRANSACTION,
  })
)

const getStoredList = (networkType, daoDomain, account) =>
  new StoredList(
    getLocalStorageKey(`activity:${daoDomain}:${account}`, networkType),
    {
      preStringify: activity => ({
        ...activity,
        status: activity.status.description.replace('ACTIVITY_STATUS_', ''),
        type: activity.type.description.replace('ACTIVITY_TYPE_', ''),
      }),
      postParse: activity => ({
        ...activity,
        status: SymbolsByName.get(`ACTIVITY_STATUS_${activity.status}`),
        type: SymbolsByName.get(`ACTIVITY_TYPE_${activity.type}`),
      }),
    }
  )

// Provides easy access to the user activities list
class ActivityProviderBase extends React.Component {
  static propTypes = {
    account: EthereumAddressType, // Current wallet
    children: PropTypes.node,
    daoDomain: PropTypes.string, // domain of current DAO
    web3: PropTypes.object,
    networkType: PropTypes.string.isRequired,
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
    this._checkInterval = setInterval(this.checkForTimedOut, 1000 * 30)
  }

  componentDidUpdate(prevProps) {
    const { daoDomain, account, networkType } = this.props
    if (
      daoDomain !== prevProps.daoDomain ||
      account !== prevProps.account ||
      networkType !== prevProps.networkType
    ) {
      this.updateStoredList()
    }
  }

  updateStoredList() {
    const { daoDomain, account, networkType } = this.props
    this._storedList = getStoredList(networkType, daoDomain, account)
    this.setState(
      { activities: this._storedList.getItems() },
      this.refreshPendingActivities
    )
  }

  componentWillUnmount() {
    clearInterval(this._checkInterval)
  }

  // Refresh the status of pending activities
  refreshPendingActivities() {
    const { web3 } = this.props

    this.state.activities
      .filter(({ status }) => status === ACTIVITY_STATUS_PENDING)
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
        activity.status === ACTIVITY_STATUS_PENDING
      ) {
        // Set pending items to timed out after 10 minutes
        this.setActivityTimedOut(activity.transactionHash)
      }
    })
  }

  addTransactionActivity = ({
    transactionHash = '',
    from = '',
    targetAppProxyAddress = '',
    forwarderProxyAddress = '',
    description = '',
  } = {}) => {
    const newActivity = {
      createdAt: Date.now(),
      type: ACTIVITY_TYPE_TRANSACTION,
      status: ACTIVITY_STATUS_PENDING,
      read: false,
      transactionHash,
      // account address from which the transaction was created
      from,
      targetAppProxyAddress,
      forwarderProxyAddress,
      description,
    }

    const updatedActivities = this._storedList.add(newActivity)

    this.setState({ activities: updatedActivities })
  }

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
      ({ status, from }) => status === ACTIVITY_STATUS_PENDING
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

  setActivityConfirmed = this.setActivityStatus(ACTIVITY_STATUS_CONFIRMED)
  setActivityFailed = this.setActivityStatus(ACTIVITY_STATUS_FAILED)
  setActivityTimedOut = this.setActivityStatus(ACTIVITY_STATUS_TIMED_OUT)

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
          activities: this.state.activities,
          addTransactionActivity: this.addTransactionActivity,
          clearActivities: this.clearActivities,
          clearActivity: this.clearActivity,
          markActivitiesRead: this.markActivitiesRead,
          setActivityConfirmed: this.setActivityConfirmed,
          setActivityFailed: this.setActivityFailed,
          setActivityNonce: this.setActivityNonce,
          updateActivities: this.updateActivities,
          unreadActivityCount,
        }}
      >
        {children}
      </ActivityContext.Provider>
    )
  }
}

function ActivityProvider(props) {
  const { account, networkType } = useWallet()
  return (
    <ActivityProviderBase
      networkType={networkType}
      account={account}
      {...props}
    />
  )
}

const ActivityConsumer = ActivityContext.Consumer

export { ActivityContext, ActivityProvider, ActivityConsumer }
