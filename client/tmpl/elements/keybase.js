import Keybase from '/client/lib/keybase'

Template.keybase_el.rendered = () => {
  this.$('.ui.search').search({
    apiSettings: {
      url: 'https://keybase.io/_/api/1.0/user/autocomplete.json?q={query}',
      onResponse: res => ({
        results: res.completions.map(c => ({
          username: c.components.username.val,
          name: (c.components.full_name || {}).val,
          pic: c.thumbnail || 'http://placekitten.com/g/64/64'
        }))
      })
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
