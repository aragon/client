export class ClientStorage {
  static prefix = 'client'

  static setItem = (key, value) => {
    window.localStorage.setItem(`${this.prefix}:${key}`, value)
  }

  static getItem = key => {
    return window.localStorage.getItem(`${this.prefix}:${key}`)
  }

  static removeItem = key => {
    return window.localStorage.removeItem(`${this.prefix}:${key}`)
  }

  static clear = () => {
    const clientKeys = []

    for (let key in window.localStorage) {
      if (key.startsWith(`${this.prefix}:`)) {
        clientKeys.push(key)
      }
    }

    clientKeys.forEach(clientKey => window.localStorage.removeItem(clientKey))
  }

  constructor() {
    throw new Error('Class Storage should not be instantiated')
  }
}
