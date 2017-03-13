// @flow

class Status {
  list: Array<string>

  constructor() {
    this.list = [
      'none',
      'employee',
      'executive',
      'superuser',
    ]
  }
  toString(status: number) {
    return this.list[status]
  }
  toNumber(status: string) {
    return this.list.indexOf(status)
  }
}

export default new Status()
