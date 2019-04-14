import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SidePanel } from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import { AppType, EthereumAddressType } from '../../prop-types'
import { addressesEqual, getInjectedProvider } from '../../web3-utils'
import ConfirmTransaction from './ConfirmTransaction'
import SigningStatus from './SigningStatus'
import { network } from '../../environment'
import { ActivityContext } from '../../contexts/ActivityContext'

import {
  STATUS_CONFIRMING,
  STATUS_SIGNING,
  STATUS_SIGNED,
  STATUS_ERROR,
} from './signer-statuses'

import springs from '../../springs'

const INITIAL_STATE = {
  panelOpened: false,
  intent: {},
  directPath: false,
  actionPaths: [],
  pretransaction: null,
  status: STATUS_CONFIRMING,
  signError: null,
}

const RECIEPT_ERROR_STATUS = '0x0'

class SignerPanel extends React.Component {
  static propTypes = {
    addTransactionActivity: PropTypes.func.isRequired,
    apps: PropTypes.arrayOf(AppType).isRequired,
    account: EthereumAddressType,
    locator: PropTypes.object.isRequired,
    onRequestEnable: PropTypes.func.isRequired,
    setActivityConfirmed: PropTypes.func.isRequired,
    setActivityFailed: PropTypes.func.isRequired,
    setActivityNonce: PropTypes.func.isRequired,
    transactionBag: PropTypes.object,
    walletNetwork: PropTypes.string.isRequired,
    walletWeb3: PropTypes.object.isRequired,
    walletProviderId: PropTypes.string.isRequired,
  }

  state = { ...INITIAL_STATE }

  componentWillReceiveProps({ transactionBag }) {
    // Received a new transaction to sign
    if (transactionBag && transactionBag !== this.props.transactionBag) {
      this.setState({
        ...INITIAL_STATE,
        panelOpened: true,
        status: STATUS_CONFIRMING,

        // When Aragon.js starts returning the new format (see
        // stateFromTransactionBag), we can simply search and replace this
        // function with `transactionBag`.
        ...this.stateFromTransactionBag(transactionBag),
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { status } = this.state
    if (prevState.status !== status && status !== STATUS_SIGNED) {
      clearTimeout(this._closeTimer)
    }
  }

  // This is a temporary method to reshape the transaction bag
  // to the future format we expect from Aragon.js
  stateFromTransactionBag(bag) {
    const { path, transaction } = bag
    return {
      intent: transaction && this.transactionIntent(bag),
      directPath: path.length === 1,
      actionPaths: path.length ? [path] : [],
      pretransaction: (transaction && transaction.pretransaction) || null,
    }
  }

  transactionIntent({ path, transaction = {} }) {
    if (path.length > 1) {
      // If the path includes forwarders, the intent is always the last node
      const lastNode = path[path.length - 1]
      const { description, name, to, annotatedDescription } = lastNode
      return { annotatedDescription, description, name, to, transaction }
    }

    // Direct path
    const { apps } = this.props
    const { annotatedDescription, description, to } = transaction
    const toApp = apps.find(app => addressesEqual(app.proxyAddress, to))
    const name = (toApp && toApp.name) || ''

    return { annotatedDescription, description, name, to, transaction }
  }

  signTransaction(transaction, intent) {
    const {
      walletWeb3,
      addTransactionActivity,
      setActivityConfirmed,
      setActivityFailed,
      setActivityNonce,
    } = this.props

    return new Promise((resolve, reject) => {
      walletWeb3.eth
        .sendTransaction(transaction)
        .on('transactionHash', transactionHash => {
          resolve(transactionHash)
          // Get account count/nonce for the transaction and update the activity item.
          // May be useful in case there are multiple pending transactions to detect when
          // a pending transaction with a lower nonce was manually re-sent by the user
          // (most likely done through their Ethereum provider directly with a different
          // gas price or transaction data that results in a different transaction hash).

          walletWeb3.eth
            .getTransaction(transactionHash)
            .then(t => {
              const { nonce } = t
              setActivityNonce({ transactionHash, nonce })
              return t
            })
            .catch(console.error)

          // Create new activiy
          addTransactionActivity({
            transactionHash,
            from: intent.transaction.from,
            targetApp: intent.name,
            targetAppProxyAddress: intent.to,
            forwarderProxyAddress: intent.transaction.to,
            description: intent.description,
          })
        })
        .on('receipt', receipt => {
          if (receipt.status === RECIEPT_ERROR_STATUS) {
            // Faliure based on EIP 658
            setActivityFailed(receipt.transactionHash)
          } else {
            setActivityConfirmed(receipt.transactionHash)
          }
        })
        .on('error', err => {
          // Called when signing failed
          err && err.transactionHash && setActivityFailed(err.transactionHash)
          reject(err)
        })
    })
  }

  handleSign = async (transaction, intent, pretransaction) => {
    const { transactionBag } = this.props

    this.setState({ status: STATUS_SIGNING })

    try {
      if (pretransaction) {
        await this.signTransaction(pretransaction, intent)
      }

      const transactionHash = await this.signTransaction(transaction, intent)

      // TODO: rename accept to resolve once https://github.com/aragon/aragon.js/pull/279 is merged
      transactionBag.accept(transactionHash)
      this.setState({ signError: null, status: STATUS_SIGNED })
      this.startClosing()

      // Display an error in the panel if a transaction fail
    } catch (err) {
      transactionBag.reject(err)
      this.setState({ signError: err, status: STATUS_ERROR })

      // TODO: the ongoing notification should be flagged faulty at this point ...
    }
  }

  startClosing = () => {
    this._closeTimer = setTimeout(() => {
      if (this.state.status === STATUS_SIGNED) {
        this.handleSignerClose()
      }
    }, 3000)
  }

  handleSignerClose = () => {
    this.setState({ panelOpened: false })
  }

  handleSignerTransitionEnd = opened => {
    // Reset signer state only after it has finished transitioning out
    if (!opened) {
      this.setState({ ...INITIAL_STATE })
    }
  }

  render() {
    const {
      account,
      locator,
      onRequestEnable,
      walletNetwork,
      walletProviderId,
    } = this.props

    const {
      panelOpened,
      signError,
      intent,
      directPath,
      actionPaths,
      pretransaction,
      status,
    } = this.state

    return (
      <SidePanel
        onClose={this.handleSignerClose}
        onTransitionEnd={this.handleSignerTransitionEnd}
        opened={panelOpened}
        title="Create transaction"
      >
        <Main>
          <Transition
            items={status === STATUS_CONFIRMING}
            from={{ enterProgress: 0 }}
            enter={{ enterProgress: 1 }}
            leave={{ enterProgress: 0 }}
            config={springs.lazy}
          >
            {confirming =>
              confirming
                ? ({ enterProgress }) => (
                    <ScreenWrapper
                      style={{
                        transform: `
                            translate3d(${-100 * (1 - enterProgress)}%, 0, 0)
                          `,
                      }}
                    >
                      <Screen>
                        <ConfirmTransaction
                          direct={directPath}
                          hasAccount={Boolean(account)}
                          hasWeb3={Boolean(getInjectedProvider())}
                          intent={intent}
                          locator={locator}
                          networkType={network.type}
                          onClose={this.handleSignerClose}
                          onRequestEnable={onRequestEnable}
                          onSign={this.handleSign}
                          paths={actionPaths}
                          pretransaction={pretransaction}
                          signingEnabled={status === STATUS_CONFIRMING}
                          walletNetworkType={walletNetwork}
                          walletProviderId={walletProviderId}
                        />
                      </Screen>
                    </ScreenWrapper>
                  )
                : ({ enterProgress }) => (
                    <ScreenWrapper
                      style={{
                        transform: `
                          translate3d(${100 * (1 - enterProgress)}%, 0, 0)
                        `,
                      }}
                    >
                      <Screen>
                        <SigningStatus
                          status={status}
                          signError={signError}
                          onClose={this.handleSignerClose}
                          walletProviderId={walletProviderId}
                        />
                      </Screen>
                    </ScreenWrapper>
                  )
            }
          </Transition>
        </Main>
      </SidePanel>
    )
  }
}

const Main = styled.div`
  position: relative;
  margin: 0 -30px;
  overflow-x: hidden;
  min-height: 0;
  flex-grow: 1;
`

const ScreenWrapper = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0 30px;
  display: flex;
  min-height: 100%;
`

const Screen = styled.div`
  width: 100%;
`

export default function(props) {
  const {
    addTransactionActivity,
    setActivityConfirmed,
    setActivityFailed,
    setActivityNonce,
  } = React.useContext(ActivityContext)
  return (
    <SignerPanel
      {...props}
      addTransactionActivity={addTransactionActivity}
      setActivityConfirmed={setActivityConfirmed}
      setActivityFailed={setActivityFailed}
      setActivityNonce={setActivityNonce}
    />
  )
}
