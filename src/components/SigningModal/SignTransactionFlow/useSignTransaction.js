import { useContext, useCallback } from 'react'
import { ActivityContext } from '../../../contexts/ActivityContext'
import { useWallet } from '../../../wallet'

const RECIEPT_ERROR_STATUS = '0x0'
const WEB3_TX_OBJECT_KEYS = new Set([
  'from',
  'to',
  'value',
  'gas',
  'gasPrice',
  'data',
  'nonce',
])

function getPretransactionDescription(intent) {
  return `Allow ${intent.name} to ${intent.description
    .slice(0, 1)
    .toLowerCase() + intent.description.slice(1)}`
}

// Clean up a transaction object removing all non-standard transaction parameters
// https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html#sendtransaction
function sanitizeTxObject(tx) {
  return Object.keys(tx)
    .filter(key => WEB3_TX_OBJECT_KEYS.has(key))
    .reduce((newTx, key) => ({ ...newTx, [key]: tx[key] }), {})
}

function useSignTransaction(web3) {
  const { web3: walletWeb3 } = useWallet()

  const {
    addTransactionActivity,
    setActivityConfirmed,
    setActivityFailed,
    setActivityNonce,
  } = useContext(ActivityContext)

  const signTransaction = useCallback(
    (transaction, intent, isPretransaction = false, onSuccess) =>
      new Promise((resolve, reject) => {
        walletWeb3.eth
          .sendTransaction(sanitizeTxObject(transaction))
          .on('transactionHash', transactionHash => {
            resolve(transactionHash)
            // Get account count/nonce for the transaction and update the activity item.
            // May be useful in case there are multiple pending transactions to detect when
            // a pending transaction with a lower nonce was manually re-sent by the user
            // (most likely done through their Ethereum wallet directly with a different
            // gas price or transaction data that results in a different transaction hash).

            web3.eth
              .getTransaction(transactionHash)
              .then(({ nonce }) => setActivityNonce({ transactionHash, nonce }))
              .catch(console.error)

            // Pretransactions are for so the app can get approval
            const description = isPretransaction
              ? getPretransactionDescription(intent)
              : intent.description

            const hasForwarder = intent.to !== intent.transaction.to

            // Create new activiy
            addTransactionActivity({
              transactionHash,
              from: intent.transaction.from,
              targetAppProxyAddress: intent.to,
              forwarderProxyAddress: hasForwarder ? intent.transaction.to : '',
              description,
            })
          })
          .on('receipt', receipt => {
            if (receipt.status === RECIEPT_ERROR_STATUS) {
              // Faliure based on EIP 658
              setActivityFailed(receipt.transactionHash)
            } else {
              setActivityConfirmed(receipt.transactionHash)
              onSuccess && onSuccess()
            }
          })
          .on('error', err => {
            // Called when signing failed
            err && err.transactionHash && setActivityFailed(err.transactionHash)
            reject(err)
          })
      }),
    [
      addTransactionActivity,
      setActivityFailed,
      setActivityNonce,
      setActivityConfirmed,
      walletWeb3,
      web3,
    ]
  )

  return signTransaction
}

export default useSignTransaction
