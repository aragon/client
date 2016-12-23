// @flow
import Mongo from 'meteor/mongo'
import PersistentMinimongo from 'meteor/frozeman:persistent-minimongo'
import EthAccounts from 'meteor/ethereum:accounts'

import Keybase from './keybase'
import Anon from './anon'

const Entities = new Mongo.Collection('entities', { connection: null })
new PersistentMinimongo(Entities)

window.Entities = Entities

const providers = {
  keybase: Keybase,
  anon: Anon,
}

const lookupAddress = async (addr: string) => {
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
    if (!entity) return null

    const formatted = providers[entity.identityProvider].format(entity.data)
    formatted.identityProvider = entity.identityProvider
    formatted.ethereumAddress = entity.ethereumAddress

    if (entity.ethereumAddress === EthAccounts.findOne().address) {
      formatted.name = 'Me'
    }

    return formatted
  }

  static async get(addr: string, raw: boolean = false) {
    let entity = Entities.findOne({ ethereumAddress: addr })

    if (!entity) {
      const { providerName, data } = await lookupAddress(addr)
      if (providerName && data) {
        Identity.set(addr, providerName, data)
        entity = Entities.findOne({ ethereumAddress: addr })
      }
    }

    if (!raw) entity = Identity.format(entity)
    return entity
  }

  static async getUsername(username, identityProvider, raw = false) {
    // Usually we will want to store addr => username but not the other way around
    // let entity = Entities.findOne(({'data.basics.username': username})
    const ethereumAddress = await providers[identityProvider].getEthAddress(username)
    const data = await providers[identityProvider].lookup(username)
    Identity.set(ethereumAddress, identityProvider, data)

    let entity = {
      identityProvider,
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
    Entities.upsert({ ethereumAddress: addr }, entity)
  }

  static setCurrent(entity) {
    Entities.update({ current: true }, { $unset: { current: '' } })
    Entities.update({ ethereumAddress: entity.ethereumAddress }, { $set: { current: true } })
  }

  static setCurrentEthereumAccount(addr) {
    Entities.update({ current: true }, { $set: { ethereumAddress: addr } })
  }

  static async current(raw = false) {
    let entity = Entities.findOne({ current: true })

    if (!raw) entity = Identity.format(entity)
    return entity
  }
}

export default Identity
