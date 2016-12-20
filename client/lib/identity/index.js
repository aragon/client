import Keybase from './keybase'

const Entities = new Mongo.Collection('entities', { connection: null })
new PersistentMinimongo(Entities)

window.Entities = Entities

const providers = {
  keybase: Keybase,
}

const lookupAddress = async (addr) => {
  let providerName = null
  let data = null
  for (providerName of Object.keys(providers)) {
    data = await providers[providerName].lookupEthAddress(addr)
    if (data) break
  }
  return { providerName, data }
}

class Identity {
  static format(entity) {
    const formatted = providers[entity.identityProvider].format(entity.data)
    formatted.identityProvider = entity.identityProvider
    formatted.ethereumAddress = entity.ethereumAddress

    if (entity.ethereumAddress === EthAccounts.findOne().address) {
      formatted.name = 'Me'
    }

    return formatted
  }

  static async get(addr, raw = false) {
    let entity = Entities.findOne({ _id: `e_${addr}` })

    if (!entity) {
      const { providerName, data } = await lookupAddress(addr)
      if (providerName && data) {
        Identity.set(addr, providerName, data)
        entity = Entities.findOne({ _id: `e_${addr}` })
      }
    }

    if (!raw) entity = Identity.format(entity)
    return entity
  }

  static async getUsername(username, providerName, raw = false) {
    // Usually we will want to store addr => username but not the other way around
    // let entity = Entities.findOne(({'data.basics.username': username})
    const ethereumAddress = await providers[providerName].getEthAddress(username)
    const data = await providers[providerName].lookup(username)
    let entity = {
      identityProvider: providerName,
      ethereumAddress,
      data,
    }

    if (!raw) entity = Identity.format(entity)
    return entity
  }

  static set(addr, identityProvider, entityObj) {
    const entity = {
      ethereumAddress: addr,
      identityProvider,
      data: entityObj,
    }
    Entities.upsert({ _id: `e_${addr}` }, entity)
  }
}

export default Identity
