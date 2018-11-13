// The user need to confirm the transaction
export const STATUS_CONFIRMING = Symbol('STATUS_CONFIRMING')

// The user need to sign the transaction in the web3 provider
export const STATUS_SIGNING = Symbol('STATUS_SIGNING')

// The transaction has been successfully signed
export const STATUS_SIGNED = Symbol('STATUS_SIGNED')

// An error happened while signing the transaction
export const STATUS_ERROR = Symbol('STATUS_ERROR')
