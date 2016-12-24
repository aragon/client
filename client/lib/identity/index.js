// @flow
import { Mongo } from 'meteor/mongo'
import { PersistentMinimongo } from 'meteor/frozeman:persistent-minimongo'
import { EthAccounts } from 'meteor/ethereum:accounts'

import type { Entity, FormattedEntity } from './entity'
import Keybase from './keybase'
import Anon from './anon'

const Entities = new Mongo.Collection('entities', { connection: null })
new PersistentMinimongo(Entities)

const providers = {
  keybase: Keybase,
  anon: Anon,
}

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
  static format(entity: Entity): FormattedEntity {
    const formatted = providers[entity.identityProvider].format(entity)
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
      const { identityProvider, data } = await lookupAddress(addr)
      if (identityProvider && data) {
        Identity.set(addr, identityProvider, data)
        entity = Entities.findOne({ ethereumAddress: addr })
      }
    }

    if (!raw) entity = Identity.format(entity)
    return entity
  }

  static async getUsername(username: string, identityProvider: string, raw: boolean = false)
    : Promise<Entity | FormattedEntity> {
    // Usually we will want to store addr => username but not the other way around
    // let entity = Entities.findOne(({'data.basics.username': username})
    const ethereumAddress = await providers[identityProvider].getEthAddress(username)
    const data = await providers[identityProvider].lookup(username)
    Identity.set(ethereumAddress, identityProvider, data)

    let entity: Entity | FormattedEntity = {
      identityProvider,
      ethereumAddress,
      data,
    }

    if (!raw) entity = Identity.format(entity)
    return entity
  }

  static set(addr: string, identityProvider: string, entityObj: Object) {
    const entity: Entity = {
      ethereumAddress: addr,
      identityProvider,
      data: entityObj,
    }
    Entities.upsert({ ethereumAddress: addr }, entity)
  }

  static setCurrent(entity: Entity) {
    Entities.update({ current: true }, { $unset: { current: '' } })
    Entities.update({ ethereumAddress: entity.ethereumAddress },
      { current: true, ...entity })
  }

  static setCurrentEthereumAccount(addr: string) {
    Entities.update({ current: true }, { $set: { ethereumAddress: addr } })
  }

  static current(raw: boolean = false) {
    let entity = Entities.findOne({ current: true })

    if (!raw) entity = Identity.format(entity)
    return entity
  }

  static async linkCurrent(identityProvider: string): Promise<boolean> {
    const current = Identity.current()

    const username = await providers[identityProvider].link(current.ethereumAddress)
    if (!username) return false

    const entity = await Identity.getUsername(username, identityProvider, true)
    console.log(entity)
    Identity.setCurrent(entity)
    return true
  }
}

export default Identity
