import React, { useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Info, noop, GU } from '@aragon/ui'
import { addressesEqual } from '../../../web3-utils'
import { AppType } from '../../../prop-types'
import { getErrorMessage } from '../utils'
import AnnotatedDescription from './AnnotatedDescription'
import DetailField from '../DetailField'
import MultiScreenModal from '../MultiScreenModal'
import SignerButton from '../SignerButton'
import {
  STEPPER_ERROR,
  STEPPER_SUCCESS,
  STEPPER_WORKING,
  STEP_SUCCESS,
} from '../TransactionStepper/stepper-statuses'
import TransactionDetails from './TransactionDetails'
import TransactionStepper from '../TransactionStepper/TransactionStepper'
import useSignTransaction from './useSignTransaction'
import useWalletError from '../useWalletError'

function getAppName(apps, proxyAddress) {
  const app = apps.find(app => addressesEqual(app.proxyAddress, proxyAddress))
  return (app && app.name) || ''
}

function shapeTransactionIntent(bag, apps) {
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
  const [error, setError] = useState(null)
  const signTransaction = useSignTransaction(web3)

  const infoDescriptions = useMemo(() => {
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
      intent:
        (transaction && shapeTransactionIntent(transactionBag, apps)) || {},
      directPath: decoratedPaths.length === 1,
      actionPaths: decoratedPaths.length ? decoratedPaths : [],
      pretransaction: (transaction && transaction.pretransaction) || null,
    }
  }, [transactionBag, apps])

  const walletError = useWalletError({
    intent: reshapedBag.intent,
    isTransaction: true,
  })

  const getHandleSign = useCallback(
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

    const stepDetails = {
      title: 'Sign transaction',
      descriptions: {
        [STEP_SUCCESS]: 'Transaction signed',
      },
    }

    const steps = [
      {
        ...stepDetails,
        handleSign: getHandleSign(
          directPath ? directTransaction : indirectTransaction,
          intent,
          false
        ),
      },
    ]

    if (pretransaction) {
      steps.unshift({
        ...stepDetails,
        handleSign: getHandleSign(pretransaction, intent, true),
      })
    }

    return steps
  }, [getHandleSign, reshapedBag])

  const screens = useMemo(() => {
    const { actionPaths, intent, directPath } = reshapedBag
    const title = 'Create transaction'
    const possible =
      directPath || (Array.isArray(actionPaths) && actionPaths.length)

    const signTransactions = [
      {
        title,
        content: modalProps => (
          <TransactionDetails
            apps={apps}
            actionPaths={actionPaths}
            directPath={directPath}
            intent={intent}
            onCreate={modalProps.nextScreen}
          />
        ),
      },
      {
        title,
        content: () => (
          <div
            css={`
              padding-top: ${3 * GU}px;
            `}
          >
            <TransactionStepper
              steps={transactionSteps}
              infoDescriptions={infoDescriptions}
            />
          </div>
        ),
      },
    ]

    const impossibleAction = [
      {
        title,
        content: modalProps => (
          <React.Fragment>
            <DetailField title="Action requirements">
              Unfortunately, you don't meet all the requirements to submit this
              action:
              <div
                css={`
                  margin-top: ${0.5 * GU}px;
                `}
              >
                <AnnotatedDescription intent={intent} />
              </div>
            </DetailField>
            <Info mode="error" title="Action impossible">
              The proposed action failed to execute. You may not have the
              required permissions.
            </Info>
            <SignerButton onClick={modalProps.closeModal}>Close</SignerButton>
          </React.Fragment>
        ),
      },
    ]

    if (walletError) {
      return [{ title, content: walletError }]
    }

    if (!possible) {
      return impossibleAction
    }

    return signTransactions
  }, [transactionSteps, reshapedBag, apps, infoDescriptions, walletError])

  return (
    <MultiScreenModal visible={visible} screens={screens} onClose={onClose} />
  )
}

SignTransactionFlow.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  onClose: PropTypes.func,
  transactionBag: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  web3: PropTypes.object.isRequired,
}

SignTransactionFlow.defaultProps = {
  onClose: noop,
}

export default SignTransactionFlow
