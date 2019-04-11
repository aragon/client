import PropTypes from 'prop-types'

// The user need to confirm the transaction
export const STATUS_CONFIRMING_TX = Symbol('STATUS_CONFIRMING_TX')

// The user need to sign the transaction in the web3 provider
export const STATUS_SIGNING_TX = Symbol('STATUS_SIGNING_TX')

// The transaction has been successfully signed
export const STATUS_SIGNED_TX = Symbol('STATUS_SIGNED_TX')

// An error happened while signing the transaction
export const STATUS_ERROR_TX = Symbol('STATUS_ERROR_TX')

// The user need to confirm the message signature
export const STATUS_CONFIRMING_MSG_SIGN = Symbol('STATUS_CONFIRMING_MSG_SIGN')

// The user need to sign the message in the web3 provider
export const STATUS_SIGNING_MESSAGE = Symbol('STATUS_SIGNING_MESSAGE')

// The message has been successfully signed
export const STATUS_MESSAGE_SIGNED = Symbol('STATUS_MESSAGE_SIGNED')

// An error happened while signing the message
export const STATUS_ERROR_SIGNING_MSG = Symbol('STATUS_ERROR_SIGNING_MSG')

// Corresponding proptype
export const SignerStatusType = PropTypes.oneOf([
  STATUS_CONFIRMING_TX,
  STATUS_SIGNING_TX,
  STATUS_SIGNED_TX,
  STATUS_ERROR_TX,
  STATUS_CONFIRMING_MSG_SIGN,
  STATUS_SIGNING_MESSAGE,
  STATUS_MESSAGE_SIGNED,
  STATUS_ERROR_SIGNING_MSG,
])

export const isTxSignerStatus = status => {
  const txStatuses = [
    STATUS_CONFIRMING_TX,
    STATUS_SIGNING_TX,
    STATUS_SIGNED_TX,
    STATUS_ERROR_TX,
  ]
  return txStatuses.indexOf(status) > -1
}

export const isConfirmingSignature = status => {
  const confirmingStatuses = [STATUS_CONFIRMING_TX, STATUS_CONFIRMING_MSG_SIGN]
  return confirmingStatuses.indexOf(status) > -1
}

export const isSignatureSuccess = status => {
  const successStatuses = [STATUS_SIGNED_TX, STATUS_MESSAGE_SIGNED]
  return successStatuses.indexOf(status) > -1
}

export const isSignatureError = status => {
  const signErrorStatuses = [STATUS_ERROR_SIGNING_MSG, STATUS_ERROR_TX]
  return signErrorStatuses.indexOf(status) > -1
}

// includes success and error cases
export const isSignatureCompleted = status => {
  return isSignatureSuccess(status) || isSignatureError(status)
}

export const isSigning = status => {
  const signatureProcessingStatuses = [
    STATUS_SIGNING_MESSAGE,
    STATUS_SIGNING_TX,
  ]
  return signatureProcessingStatuses.indexOf(status) > -1
}
