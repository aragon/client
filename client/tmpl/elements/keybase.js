import Keybase from '/client/lib/keybase'

Template.keybase_el.rendered = () => {
  let tmplInstance = this

  this.$('.ui.search').search({
    apiSettings: {
      url: 'https://keybase.io/_/api/1.0/user/autocomplete.json?q={query}',
      onResponse: (res) => {
        let results = []
        for (let completion of res.completions) {
          let comps = completion.components
          let user = {
            username: comps.username.val,
            name: (comps.full_name || {}).val,
            pic: completion.thumbnail || 'http://placekitten.com/g/64/64'
          }
          results.push(user)
        }
        return {results}
      }
    },
    fields: {
      title: 'name',
      description: 'username',
      image: 'pic'
    },
    minCharacters: 2,
    onSelect: async (user) => {
      let addr = await Keybase.getEthereumAddress(user.username)
      user.addr = addr
      Session.set('selectedKeybaseUser', user)
    }
  })
}
