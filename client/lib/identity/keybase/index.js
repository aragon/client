// @flow
import type { Entity } from '../entity'

import link from './link'
import Proofs from './proofs'

import { KeybaseRegistry } from '/client/lib/ethereum/contracts'

const keybaseBaseURL: string = 'https://keybase.io/_/api/1.0'

const IS_DEV = true
const proofFilename = `ethereum${IS_DEV ? '_ropsten' : ''}.json`

export default class Keybase {
  // Returns {status, them}
  static async lookup(username: string): Object {
    if (!username) return null
    const res = await fetch(`${keybaseBaseURL}/user/lookup.json?usernames=${username}`)
    const json = await res.json()
    const data = json.them[0]
    // Ugly hack because Minimongo decided not to tolerate dots in its props
    if (data.proofs_summary.by_presentation_group) {
      for (const key of Object.keys(data.proofs_summary.by_presentation_group)) {
        if (key.indexOf('.') !== -1) {
          data.proofs_summary.by_presentation_group[key.replace('.', '/')] = data.proofs_summary.by_presentation_group[key]
          delete data.proofs_summary.by_presentation_group[key]
        }
      }
    }
    return data
  }

  static async getVerifiedEthereumAddress(username: string): Promise<string> {
    const res = await fetch(`cors://${username}.keybase.pub/${proofFilename}`)
    const proof = await res.json()
    return Proofs.verifyProof(proof)
  }

  static async lookupEthAddress(addr: string): Promise<Object> {
    const registry = await KeybaseRegistry.deployed()
    const username = await registry.getUsername(addr)
    console.log('looked up username', username)
    if (!username || username === '') return undefined
    return await Keybase.lookup(username)
  }

  static format(entity: Entity) {
    const data = entity.data
    if (!data || data === {}) return null

    const formatted = {
      username: data.basics.username,
      name: data.profile.full_name,
      picture: data.pictures.primary.url,
      location: data.profile.location,
      bio: data.profile.bio,
      pubkey: {
        fingerprint: data.public_keys.primary.key_fingerprint.slice(24).toUpperCase(),
        content: data.public_keys.primary.bundle,
      },
      cryptocurrencies: {},
      social: {},
    }
    for (const cryptoName of Object.keys(data.cryptocurrency_addresses)) {
      formatted.cryptocurrencies[cryptoName] =
        data.cryptocurrency_addresses[cryptoName][0].address
    }
    for (const proofName of Object.keys(data.proofs_summary.by_presentation_group)) {
      if (proofName.indexOf('.') !== -1) proofName.replace('/', '.')
      formatted.social[proofName] =
        data.proofs_summary.by_presentation_group[proofName][0].nametag
    }
    return formatted
  }

  static async link(addr: string): string {
    if (!ipcRenderer) {
      alert('You need to use our desktop app and the Keybase desktop app in order to link your identity.')
      return ''
    }
    return link(addr, proofFilename)
  }
}
