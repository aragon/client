import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { SidePanel, breakpoint } from '@aragon/ui'
import { Transition, animated } from 'react-spring'
import { addressesEqual } from '../../web3-utils'
import { noop } from '../../utils'
import ConfirmTransaction from './ConfirmTransaction'
import SigningStatus from './SigningStatus'
import { network } from '../../environment'
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

class SignerPanel extends React.Component {
  static propTypes = {
    apps: PropTypes.array,
    account: PropTypes.string,
    walletNetwork: PropTypes.string,
    walletWeb3: PropTypes.object,
    walletProviderId: PropTypes.string,
    transactionBag: PropTypes.object,
    onRequestEnable: PropTypes.func,
  }

  static defaultProps = {
    apps: [],
    account: '',
    walletProviderId: '',
    onRequestEnable: noop,
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

  async signTransaction(transaction, intent) {
    const { walletWeb3 } = this.props
    return new Promise((resolve, reject) => {
      walletWeb3.eth.sendTransaction(transaction, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
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

      const transactionRes = await this.signTransaction(transaction, intent)
      transactionBag.accept(transactionRes)
      this.setState({ signError: null, status: STATUS_SIGNED })
      this.startClosing()

      // Display an error in the panel if a transaction fail
    } catch (err) {
      transactionBag.reject(err)
      this.setState({ signError: err, status: STATUS_ERROR })
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
      walletWeb3,
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
      <ResponsiveSidePanel>
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
                            hasWeb3={Boolean(walletWeb3)}
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
      </ResponsiveSidePanel>
    )
  }
}

const ResponsiveSidePanel = styled.div`
  & > div {
    left: -90px;
    right: 90px;
  }
  &&& aside {
    position: relative;
    width: 100%;
    padding-right: 0;
  }

  ${breakpoint(
    'medium',
    `
      & > div {
        left: 0;
        right: 0;
      }
      &&& aside {
        position: absolute;
        width: auto;
        padding-right: 90px;
      }
    `
  )}
`

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

export default SignerPanel
