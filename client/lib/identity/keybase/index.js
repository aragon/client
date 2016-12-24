// @flow
import type { Entity } from '../entity'

import link from './link'

const keybaseBaseURL: string = 'https://keybase.io/_/api/1.0'

export default class Keybase {
  // Returns {status, them}
  static async lookup(username: string): Object {
    if (!username) return null
    const res = await fetch(`${keybaseBaseURL}/user/lookup.json?usernames=${username}`)
    const data = await res.json()
    return data.them[0]
  }

  static async getEthAddress(username: string): Promise<string> {
    const res = await fetch(`https://${username}.keybase.pub/eth`)
    const text = await res.text()
    return text.trim()
  }

  static async lookupEthAddress(addr: string): Promise<Object> {
    return await Keybase.lookup('li')
  }

  static format(entity: Entity) {
    const data = entity.data

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
      formatted.social[proofName] =
        data.proofs_summary.by_presentation_group[proofName][0].nametag
    }
    return formatted
  }

  static link(addr: string): string {
    return link(addr)
  }
}
