let instance

class LocalStorage {
  constructor() {
    if (instance) {
      return instance
    }
    instance = this
    instance.cachePrefix = null
  }

  _getKey(key, usePrefix) {
    return usePrefix ? `${this.cachePrefix}:${key}` : key
  }

  setPrefix(prefix) {
    this.cachePrefix = prefix
  }

  set(key, value, usePrefix = true) {
    if (key == null) {
      return
    }

    localStorage.setItem(this._getKey(key, usePrefix), value)
  }

  get(key, usePrefix = true) {
    return localStorage.getItem(this._getKey(key, usePrefix))
  }
}

export const LocalStorageWrapper = new LocalStorage()
