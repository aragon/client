import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { AppType } from '../../prop-types'
import SignMessageFlow from './SignMessageFlow'
import SignTransactionFlow from './SignTransactionFlow/SignTransactionFlow'

function SigningModal({ apps, transactionBag, signatureBag, web3 }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [isTransaction, setIsTransaction] = useState(false)

  const prevTxBag = useRef()
  const prevSigBag = useRef()

  const handleClose = () => setModalVisible(false)

  const sigBagUpdate =
    signatureBag && signatureBag !== prevSigBag.current && signatureBag
  const txBagUpdate =
    transactionBag && transactionBag !== prevTxBag.current && transactionBag

  useEffect(() => {
    if (txBagUpdate) {
      setModalVisible(true)
      setIsTransaction(true)
      prevTxBag.current = txBagUpdate
    }
  }, [txBagUpdate])

  useEffect(() => {
    if (sigBagUpdate) {
      setModalVisible(true)
      setIsTransaction(false)
      prevSigBag.current = sigBagUpdate
    }
  }, [sigBagUpdate])

  return (
    <React.Fragment>
      {isTransaction
        ? transactionBag && (
            <SignTransactionFlow
              apps={apps}
              onClose={handleClose}
              transactionBag={transactionBag}
              visible={modalVisible}
              web3={web3}
            />
          )
        : signatureBag && (
            <SignMessageFlow
              apps={apps}
              onClose={handleClose}
              signatureBag={signatureBag}
              visible={modalVisible}
            />
          )}
    </React.Fragment>
  )
}

SigningModal.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  transactionBag: PropTypes.object,
  signatureBag: PropTypes.object,
  web3: PropTypes.object.isRequired,
}

export default React.memo(SigningModal)
