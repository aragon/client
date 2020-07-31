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

  useEffect(() => {
    // Show modal only when a bag is updated with values
    if (transactionBag !== prevTxBag.current && transactionBag) {
      setModalVisible(true)
      setIsTransaction(true)
    }

    prevTxBag.current = transactionBag
  }, [transactionBag])

  useEffect(() => {
    if (signatureBag !== prevSigBag.current && signatureBag) {
      setModalVisible(true)
      setIsTransaction(false)
    }

    prevSigBag.current = signatureBag
  }, [signatureBag])

  return (
    <React.Fragment>
      {isTransaction
        ? transactionBag && (
            <SignTransactionFlow
              apps={apps}
              onClose={() => setModalVisible(false)}
              transactionBag={transactionBag}
              visible={modalVisible}
              web3={web3}
            />
          )
        : signatureBag && (
            <SignMessageFlow
              apps={apps}
              onClose={() => setModalVisible(false)}
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
