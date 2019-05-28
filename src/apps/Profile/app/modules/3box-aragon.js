import Box from '3box'

const supportedJsonRPCMethods = new Set(['personal_sign'])
const supportedJsonRPCVersions = new Set(['2.0'])

const supportedMethod = (method, jsonRPCVersion) => {
  return (
    supportedJsonRPCVersions.has(jsonRPCVersion) &&
    supportedJsonRPCMethods.has(method)
  )
}

class BoxAragonBridge {
  constructor(ethereumAddress, requestSignMessage) {
    this.ethereumAddress = ethereumAddress
    this.requestSignMessage = requestSignMessage
  }

  getMethod = method => {
    const methods = {
      personal_sign: async ([message], callback) => {
        this.requestSignMessage(message).subscribe(
          signature => callback(null, { result: signature, error: null }),
          error => callback(error, { error })
        )
      },
    }

    return methods[method]
  }

  sendAsync = async ({ fromAddress, method, params, jsonrpc }, callback) => {
    if (!supportedMethod(method, jsonrpc)) {
      throw new Error('Unsupported sendAsync json rpc method or version')
    }

    if (fromAddress.toLowerCase() !== this.ethereumAddress.toLowerCase()) {
      throw new Error('Address mismatch')
    }

    const handler = this.getMethod(method)
    handler(params, callback)
  }
}

export class Profile {
  constructor(ethereumAddress, aragonApi) {
    this.ethereumAddress = ethereumAddress
    this.boxAragonBridge = new BoxAragonBridge(
      ethereumAddress,
      aragonApi.requestSignMessage.bind(aragonApi)
    )
    this.boxState = {
      opened: false,
      errorFetchingBox: false,
    }
    this.unlockedBox = null
  }

  getPublic = () =>
    this.boxState.opened
      ? this.unlockedBox.public.all()
      : Box.getProfile(this.ethereumAddress)

  unlock = async () => {
    const openedBox = await Box.openBox(
      this.ethereumAddress,
      this.boxAragonBridge
    )
    this.boxState = { opened: true, synced: false }
    this.unlockedBox = openedBox
    return openedBox
  }

  sync = () =>
    new Promise((resolve, reject) => {
      if (this.boxState.opened) {
        this.unlockedBox.onSyncDone(() => {
          try {
            this.boxState = { opened: true, synced: true }
            return resolve(this.unlockedBox)
          } catch (err) {
            this.boxState = { opened: true, synced: false }
            return reject(err)
          }
        })
      } else
        reject(new Error('Box needs to be unlocked before it can be synced'))
    })

  unlockAndSync = () =>
    new Promise(async (resolve, reject) => {
      let openedBox
      try {
        openedBox = await Box.openBox(
          this.ethereumAddress,
          this.boxAragonBridge
        )
      } catch (err) {
        return reject(err)
      }

      this.boxState = { opened: true, synced: false }
      this.unlockedBox = openedBox

      openedBox.onSyncDone(() => {
        try {
          this.boxState = { opened: true, synced: true }
          return resolve(openedBox)
        } catch (err) {
          this.boxState = { opened: false, synced: false }
          return reject(err)
        }
      })
    })

  createProfile = () => this.unlockedBox.linkAccount()

  hasProfile = async () => {
    if (this.boxState.opened) {
      return this.unlockedBox.isAccountLinked()
    }
    const publicProfile = await this.getPublic()
    return Object.keys(publicProfile).length > 1
  }

  isLoggedIn = () => Box.isLoggedIn(this.ethereumAddress)

  logout = () => this.unlockedBox.logout()

  getPrivate = () => {
    if (this.boxState.opened && this.boxState.synced) {
      return this.unlockedBox.private.all()
    }

    throw new Error('box was not unlocked or has not finished syncing')
  }

  checkForErrorsBeforeSetting = (fields, values) => {
    if (!this.boxState.opened || !this.boxState.synced) {
      throw new Error('box was not unlocked or has not finished syncing')
    }
    if (!Array.isArray(fields) || !Array.isArray(values)) {
      throw new Error('must pass two arrays')
    }
  }

  setPublicFields = async (fields, values) => {
    this.checkForErrorsBeforeSetting(fields, values)
    try {
      await this.unlockedBox.public.setMultiple(fields, values)
    } catch (err) {
      throw new Error(`Error setting in box: ${err}`)
    }
  }

  setPrivateFields = async (fields, values) => {
    this.checkForErrorsBeforeSetting(fields, values)
    try {
      await this.unlockedBox.private.setMultiple(fields, values)
    } catch (err) {
      throw new Error(`Error setting in box: ${err}`)
    }
  }

  removePublicField = async field => {
    try {
      await this.unlockedBox.public.remove(field)
    } catch (err) {
      throw new Error(`Error removing field from box ${err}`)
    }
  }

  removePrivateField = async field => {
    try {
      await this.unlockedBox.private.remove(field)
    } catch (err) {
      throw new Error(`Error removing field from box ${err}`)
    }
  }
}
