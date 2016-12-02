const keybaseBaseURL = 'https://keybase.io/_/api/1.0'
const kbfsBaseURL = 'https://keybase-pub-proxy-lekobkzhwp.now.sh'

class Keybase {
  // Returns {status, them}
  static async lookup(username) {
    const data = await fetch(`${keybaseBaseURL}/user/lookup.json?usernames=${username}`)
    return data.json()
  }

  static async getEthereumAddress(username) {
    const data = await fetch(`${kbfsBaseURL}/ethereum.json?username=${username}`)
    const responseBody = await data.json()
    return responseBody.address
  }
}

export default Keybase
