const keybaseBaseURL = 'https://keybase.io/_/api/1.0'
const kbfsBaseURL = 'https://keybase-pub-proxy-lekobkzhwp.now.sh'

class Keybase {
  // Returns {status, them}
  static async lookup(username) {
    if (!username) return null
    const res = await fetch(`${keybaseBaseURL}/user/lookup.json?usernames=${username}`)
    const data = await res.json()
    return data.them[0]
  }

  static async getEthereumAddress(username) {
    if (!username) return null
    const res = await fetch(`${kbfsBaseURL}/eth?username=${username}`)
    return await res.text()
  }

  static async lookupEthAddress(addr) {
    return await Keybase.lookup('li')
  }

  static format(data) {
    return {
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
  }
}

Keybase.name = 'keybase'

export default Keybase
