import PropTypes from 'prop-types'

// The user need to confirm the transaction
export const STATUS_CONFIRMING = Symbol('STATUS_CONFIRMING')

// The user need to sign the transaction in the web3 provider
export const STATUS_SIGNING = Symbol('STATUS_SIGNING')

// The transaction has been successfully signed
export const STATUS_SIGNED = Symbol('STATUS_SIGNED')

// An error happened while signing the transaction
export const STATUS_ERROR = Symbol('STATUS_ERROR')

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
  STATUS_CONFIRMING,
  STATUS_SIGNING,
  STATUS_SIGNED,
  STATUS_ERROR,
  STATUS_CONFIRMING_MSG_SIGN,
  STATUS_SIGNING_MESSAGE,
  STATUS_MESSAGE_SIGNED,
  STATUS_ERROR_SIGNING_MSG,
])

export const isTxSignRequest = status => {
  const txStatuses = [
    STATUS_CONFIRMING,
    STATUS_SIGNING,
    STATUS_SIGNED,
    STATUS_ERROR,
  ]
  return txStatuses.indexOf(status) > -1
}

export const confirmingSignature = status => {
  const confirmingStatuses = [STATUS_CONFIRMING, STATUS_CONFIRMING_MSG_SIGN]
  return confirmingStatuses.indexOf(status) > -1
}

export const signatureSuccess = status => {
  const successStatuses = [STATUS_SIGNED, STATUS_MESSAGE_SIGNED]
  return successStatuses.indexOf(status) > -1
}

export const signatureError = status => {
  const signErrorStatuses = [STATUS_ERROR_SIGNING_MSG, STATUS_ERROR]
  return signErrorStatuses.indexOf(status) > -1
}

// includes success and error cases
export const signatureCompleted = status => {
  return signatureSuccess(status) || signatureError(status)
}

export const isSigning = status => {
  const signatureProcessingStatuses = [STATUS_SIGNING_MESSAGE, STATUS_SIGNING]
  return signatureProcessingStatuses.indexOf(status) > -1
}
