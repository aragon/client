import Identity from '/client/lib/identity'

const tmpl = Template.Element_IdentityAutocomplete

const bindSearch = (tmplIns) => {
  const keybaseEl = tmplIns.$('.keybaseEl')
  tmplIns.$('.ui.search').search({
    apiSettings: {
      url: 'https://keybase.io/_/api/1.0/user/autocomplete.json?q={query}',
      onResponse: res => {
        let additionalElements = []
        const query = $('.ui.search .prompt').val()

        if (web3.isAddress(query)) {
          additionalElements.push({ name: "Use address", username: query })
        }

        return {
          results: res.completions.map(c => ({
                      username: c.components.username.val,
                      name: (c.components.full_name || {}).val,
                      pic: c.thumbnail || 'http://placekitten.com/g/64/64',
          })).concat(additionalElements)
        }
      }
    },
    fields: {
      title: 'name',
      description: 'username',
      image: 'pic',
    },
    minCharacters: 2,
    onSelect: async (user) => {
      tmplIns.$('.ui.search').addClass('loading')
      let entity = {}
      if (web3.isAddress(user.username)) {
        entity = { ethereumAddress: user.username, name: 'Address' }
      } else {
        entity = await Identity.getUsername(user.username, 'keybase')
      }
      TemplateVar.set(tmplIns, 'entity', entity)
      keybaseEl.trigger('select', entity)
    },
  })
}

tmpl.onRendered(() => bindSearch(Template.instance()))

tmpl.events({
  'click .remove': () => {
    TemplateVar.set('entity', null)
    setTimeout(bindSearch.bind(this, Template.instance()), 100)
  },
})

tmpl.helpers({
  entity: () => TemplateVar.get('entity'),
})
