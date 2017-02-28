// @flow
import { Mongo } from 'meteor/mongo'
import { EthAccounts } from 'meteor/ethereum:accounts'
import { PersistentMinimongo } from 'meteor/frozeman:persistent-minimongo'

import type { Entity, FormattedEntity } from './entity'
import Keybase from './keybase'
import Anon from './anon'

const Entities = new Mongo.Collection('entities', { connection: null })
new PersistentMinimongo(Entities)

window.Entities = Entities

const providers = {
  keybase: Keybase,
  anon: Anon,
}

console.log(providers)

const lookupAddress = async (addr: string): Object => {
  let identityProvider = null
  let data = null
  for (identityProvider of Object.keys(providers)) {
    data = await providers[identityProvider].lookupEthAddress(addr)
    if (data) break
  }
  return { identityProvider, data }
}

class Identity {
  Entities: Mongo.Collection

  static format(entity: Entity, replaceMe: boolean = true): FormattedEntity {
    const formatted = providers[entity.identityProvider].format(entity)
    formatted.identityProvider = entity.identityProvider
    formatted.ethereumAddress = entity.ethereumAddress
    formatted.status = entity.status || 'None'

    if (entity.ethereumAddress === Identity.current(true).ethereumAddress && replaceMe) {
      formatted.name = 'Me'
    }

    return formatted
  }

  static async getRaw(addr: string) {
    if (!addr) return {}

    let entity = Entities.findOne({ ethereumAddress: addr })

    if (!entity) {
      const { identityProvider, data } = await lookupAddress(addr)
      if (identityProvider && data) {
        Identity.set(addr, identityProvider, data)
        entity = Entities.findOne({ ethereumAddress: addr })
      }
    } else if (!entity.identityProvider) {
      entity.identityProvider = 'anon'
    }

    return entity
  }

  static async get(addr: string) {
    const entity = await Identity.getRaw(addr)
    return Identity.format(entity)
  }

  static async getUsernameRaw(username: string, identityProvider: string):
    Promise<Entity> {
    // Usually we will want to store addr => username but not the other way around
    // let entity = Entities.findOne(({'data.basics.username': username})
    const ethereumAddress =
      await providers[identityProvider].getVerifiedEthereumAddress(username)
    const data = await providers[identityProvider].lookup(username)
    Identity.set(ethereumAddress, identityProvider, data)

    const entity: Entity = {
      identityProvider,
      ethereumAddress,
      data,
    }

    return entity
  }

  static async getUsername(username: string, identityProvider: string):
    Promise<FormattedEntity> {
    const entity = await Identity.getUsernameRaw(username, identityProvider)
    return Identity.format(entity)
  }

  static set(addr: string, identityProvider: string, entityObj: Object) {
    console.log(`Identity: Setting ${addr}`)
    const entity: Entity = {
      ethereumAddress: addr,
      identityProvider,
      data: entityObj,
      status: 0,
    }
    Entities.upsert({ ethereumAddress: addr }, { $set: { ...entity } })
  }

  static setCurrent(entity: Entity) {
    Entities.update({ current: true }, { $unset: { current: '' } })
    delete entity._id
    console.log(`Identity: Setting ${entity.ethereumAddress} as current`)
    Entities.update({ ethereumAddress: entity.ethereumAddress },
      { $set: { current: true, ...entity } })
  }

  static setCurrentEthereumAccount(addr: string) {
    const current = Identity.current(true)
    console.log(`Identity: Setting ${addr} as current Ethereum account`)
    Entities.update({ current: true }, { $unset: { current: '' } })
    if (current) {
      delete current.ethereumAddress
      delete current._id
    }
    Entities.upsert({ ethereumAddress: addr }, { $set: { ...current } })
  }

  static current(raw: boolean = false, replaceMe: boolean = true) {
    let entity = Entities.findOne({ current: true })
    if (!entity) return {}

    if (!raw) entity = Identity.format(entity, replaceMe)
    return entity || {}
  }

  static async linkCurrent(identityProvider: string): Promise<boolean> {
    const current = Identity.current()

    const username = await (providers[identityProvider] || Keybase).link(current.ethereumAddress)
    if (!username) return false

    const entity = await Identity.getUsernameRaw(username, identityProvider)
    Identity.setCurrent(entity)

    return true
  }

  static async reset(): Promise<boolean> {
    if (EthAccounts.findOne()) {
      const current = await Identity.getRaw(EthAccounts.findOne().address, true)
      Identity.setCurrent(current)
      return true
    }
    return false
  }
}

Identity.Entities = Entities

export default Identity
export { Entities }
