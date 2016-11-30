export class Keybase {
  // Returns {status, completions}
  static async autocomplete(str) {
    let data = await fetch(`https://keybase.io/_/api/1.0/user/autocomplete.json?q=${str}`)
    return data.json()
  }

  // Returns {status, them}
  static async lookup(username) {
    let data = await fetch(`https://keybase.io/_/api/1.0/user/lookup.json?usernames=${username}`)
    return data.json()
  }
}
