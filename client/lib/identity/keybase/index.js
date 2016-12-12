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
    const res = await fetch(`${kbfsBaseURL}/ethereum.json?username=${username}`)
    const data = await res.json()
    return data.address
  }
}

export default Keybase
