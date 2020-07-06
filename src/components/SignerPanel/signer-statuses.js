import PropTypes from 'prop-types'

// The user need to confirm the transaction
export const STATUS_TX_CONFIRMING = Symbol('STATUS_TX_CONFIRMING')

// The user need to sign the transaction in their wallet
export const STATUS_TX_SIGNING = Symbol('STATUS_TX_SIGNING')

// The transaction has been successfully signed
export const STATUS_TX_SIGNED = Symbol('STATUS_TX_SIGNED')

// An error happened while signing the transaction
export const STATUS_TX_ERROR = Symbol('STATUS_TX_ERROR')

// The user need to confirm the message signature
export const STATUS_MSG_CONFIRMING = Symbol('STATUS_MSG_CONFIRMING')

// The user need to sign the message in their wallet
export const STATUS_MSG_SIGNING = Symbol('STATUS_MSG_SIGNING')

// The message has been successfully signed
export const STATUS_MSG_SIGNED = Symbol('STATUS_MSG_SIGNED')

// An error happened while signing the message
export const STATUS_MSG_ERROR = Symbol('STATUS_MSG_ERROR')

// Corresponding proptype
export const SignerStatusType = PropTypes.oneOf([
  STATUS_TX_CONFIRMING,
  STATUS_TX_SIGNING,
  STATUS_TX_SIGNED,
  STATUS_TX_ERROR,
  STATUS_MSG_CONFIRMING,
  STATUS_MSG_SIGNING,
  STATUS_MSG_SIGNED,
  STATUS_MSG_ERROR,
])

export const isTxSignerStatus = status => {
  const txStatuses = [
    STATUS_TX_CONFIRMING,
    STATUS_TX_SIGNING,
    STATUS_TX_SIGNED,
    STATUS_TX_ERROR,
  ]
  return txStatuses.indexOf(status) > -1
}

export const isConfirmingSignature = status => {
  const confirmingStatuses = [STATUS_TX_CONFIRMING, STATUS_MSG_CONFIRMING]
  return confirmingStatuses.indexOf(status) > -1
}

export const isSignatureSuccess = status => {
  const successStatuses = [STATUS_TX_SIGNED, STATUS_MSG_SIGNED]
  return successStatuses.indexOf(status) > -1
}

export const isSignatureError = status => {
  const signErrorStatuses = [STATUS_MSG_ERROR, STATUS_TX_ERROR]
  return signErrorStatuses.indexOf(status) > -1
}

// includes success and error cases
export const isSignatureCompleted = status => {
  return isSignatureSuccess(status) || isSignatureError(status)
}

export const isSigning = status => {
  const signatureProcessingStatuses = [STATUS_MSG_SIGNING, STATUS_TX_SIGNING]
  return signatureProcessingStatuses.indexOf(status) > -1
}
