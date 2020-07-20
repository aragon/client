import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { noop, GU } from '@aragon/ui'
import { addressesEqual } from '../../../web3-utils'
import { AppType } from '../../../prop-types'
import { getErrorMessage } from '../utils'
import MultiScreenModal from '../MultiScreenModal'
import {
  STEPPER_ERROR,
  STEPPER_SUCCESS,
  STEPPER_WORKING,
  STEP_SUCCESS,
} from '../TransactionStepper/stepper-statuses'
import TransactionDetails from './TransactionDetails'
import TransactionStepper from '../TransactionStepper/TransactionStepper'
import useSignTransaction from './useSignTransaction'

function getAppName(apps, proxyAddress) {
  const app = apps.find(app => addressesEqual(app.proxyAddress, proxyAddress))
  return (app && app.name) || ''
}

const STEP_DESC = {
  [STEP_SUCCESS]: 'Transaction signed',
}

function transactionIntent(bag, apps) {
  const { external, path, transaction = {} } = bag

  // If the path includes forwarders, the intent is always the last node
  // Otherwise, it's the direct transaction
  const targetIntent = path.length > 1 ? path[path.length - 1] : transaction
  const { annotatedDescription, description, to } = targetIntent
  const name = getAppName(apps, to)
  const installed = apps.some(
    ({ proxyAddress }) => proxyAddress === transaction.to
  )

  return {
    annotatedDescription,
    description,
    external,
    installed,
    name,
    to,
    transaction,
  }
}

function SignTransactionFlow({ transactionBag, web3, apps, visible, onClose }) {
  const [error, setError] = useState()
  const signTransaction = useSignTransaction(web3)

  const infoMessages = useMemo(() => {
    return {
      [STEPPER_WORKING]: `Open your Ethereum provider (Metamask or similar) to sign the transactions. Do not close the web browser window until the process is finished.`,
      [STEPPER_SUCCESS]: `Success! The transaction has been sent to the network for processing. You can close this window.`,
      [STEPPER_ERROR]: getErrorMessage(
        `Your transaction wasn't signed and no tokens were sent.`,
        error
      ),
    }
  }, [error])

  // This is temporary to reshape the transaction bag
  // to the future format we expect from Aragon.js
  const reshapedBag = useMemo(() => {
    const { path, transaction } = transactionBag
    const decoratedPaths = path.map(path => ({
      ...path,
      name: getAppName(apps, path.to),
    }))

    return {
      intent: (transaction && transactionIntent(transactionBag, apps)) || {},
      directPath: decoratedPaths.length === 1,
      actionPaths: decoratedPaths.length ? decoratedPaths : [],
      pretransaction: (transaction && transaction.pretransaction) || null,
    }
  }, [transactionBag, apps])

  const getSignHandler = useCallback(
    (transaction, intent, isPretransaction) => async ({
      setStepHash,
      setStepSuccess,
      setStepError,
    }) => {
      try {
        const transactionHash = await signTransaction(
          transaction,
          intent,
          isPretransaction
        )

        setStepHash(transactionHash)
        setStepSuccess()

        transactionBag.resolve(transactionHash)
      } catch (err) {
        transactionBag.reject(err)
        setError(err)
        setStepError()
      }
    },
    [transactionBag, signTransaction]
  )

  const transactionSteps = useMemo(() => {
    const { directPath, intent, actionPaths, pretransaction } = reshapedBag
    const directTransaction = intent.transaction
    const indirectTransaction = actionPaths && actionPaths[0]

    const stepsToRender = [
      {
        title: 'Sign transaction',
        descriptions: STEP_DESC,
        handleSign: getSignHandler(
          directPath ? directTransaction : indirectTransaction,
          intent,
          false
        ),
      },
    ]

    if (pretransaction) {
      stepsToRender.unshift({
        title: 'Sign transaction',
        descriptions: STEP_DESC,
        handleSign: getSignHandler(pretransaction, intent, true),
      })
    }

    return stepsToRender
  }, [getSignHandler, reshapedBag])

  const modalScreens = useMemo(() => {
    const { actionPaths, intent, directPath } = reshapedBag

    return [
      {
        title: 'Create transaction',
        content: modalProps => (
          <TransactionDetails
            actionPaths={actionPaths}
            apps={apps}
            directPath={directPath}
            intent={intent}
            modalProps={modalProps}
          />
        ),
      },
      {
        title: 'Create transaction',
        content: () => (
          <div
            css={`
              padding-top: ${3 * GU}px;
            `}
          >
            <TransactionStepper steps={transactionSteps} info={infoMessages} />
          </div>
        ),
      },
    ]
  }, [transactionSteps, reshapedBag, apps, infoMessages])

  return (
    <MultiScreenModal
      visible={visible}
      screens={modalScreens}
      onClose={onClose}
    />
  )
}

SignTransactionFlow.propTypes = {
  transactionBag: PropTypes.object,
  apps: PropTypes.arrayOf(AppType).isRequired,
  web3: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
}

SignTransactionFlow.defaultProps = {
  onClose: noop,
}

export default SignTransactionFlow
