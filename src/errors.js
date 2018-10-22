const extendError = (name, { defaultMessage }) =>
  class extends Error {
    name = name
    constructor(message = defaultMessage) {
      super(message)
    }
  }

export const InvalidAddress = extendError('InvalidAddress', {
  defaultMessage: 'The address is invalid',
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
