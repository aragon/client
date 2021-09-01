export const extendError = (name, { defaultMessage }) =>
  class extends Error {
    name = name
    constructor(message = defaultMessage) {
      super(message)
    }
  }

export const InvalidAddress = extendError('InvalidAddress', {
  defaultMessage: 'The address is invalid',
})
export const RequiredField = extendError('RequiredField', {
  defaultMessage: 'This field is required.',
})
export const InvalidNetworkType = extendError('InvalidNetworkType', {
  defaultMessage: 'The network type is invalid',
})
export const InvalidURI = extendError('InvalidURI', {
  defaultMessage: 'The URI is invalid',
})
export const NoConnection = extendError('NoConnection', {
  defaultMessage: 'There is no connection',
})
export class DAONotFound extends Error {
  name = 'DAONotFound'
  constructor(dao) {
    super('The ENS address of this dao could not be resolved')
    this.dao = dao
  }
}
