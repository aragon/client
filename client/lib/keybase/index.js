class Keybase {
  static async lookup(username) {
    let data = await fetch("https://keybase.io/_/api/1.0/user/lookup.json?usernames=#{username}")
    console.log(data.json())
    return data.json()
  }
}

module.exports = Keybase
