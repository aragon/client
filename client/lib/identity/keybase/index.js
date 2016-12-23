// @flow
import type { Entity } from '../entity'

const keybaseBaseURL = 'https://keybase.io/_/api/1.0'

export default class Keybase {
  // Returns {status, them}
  static async lookup(username: string) {
    if (!username) return null
    const res = await fetch(`${keybaseBaseURL}/user/lookup.json?usernames=${username}`)
    const data = await res.json()
    return data.them[0]
  }

  static async getEthAddress(username: string) {
    if (!username) return null
    const res = await fetch(`https://${username}.keybase.pub/eth`)
    const text = await res.text()
    return text.trim()
  }

  static async lookupEthAddress(addr: string) {
    return await Keybase.lookup('li')
  }

  static format(data) {
    const entity: Entity = {
      username: data.basics.username,
      name: data.profile.full_name,
      picture: data.pictures.primary.url,
      location: data.profile.location,
      bio: data.profile.bio,
      pubkey: {
        fingerprint: data.public_keys.primary.key_fingerprint.slice(24).toUpperCase(),
        content: data.public_keys.primary.bundle,
      },
      cryptocurrencies: {
        bitcoin: data.cryptocurrency_addresses.bitcoin[0].address,
      },
      social: {
        twitter: data.proofs_summary.by_presentation_group.twitter[0].nametag,
        facebook: data.proofs_summary.by_presentation_group.facebook[0].nametag,
        github: data.proofs_summary.by_presentation_group.github[0].nametag,
      },
    }
    return entity
  }
}
