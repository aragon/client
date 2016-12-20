import Identity from '/client/lib/identity'

const tmpl = Template.Element_IdentityAutocomplete

const bindSearch = (tmplIns) => {
  const keybaseEl = tmplIns.$('.keybaseEl')
  tmplIns.$('.ui.search').search({
    apiSettings: {
      url: 'https://keybase.io/_/api/1.0/user/autocomplete.json?q={query}',
      onResponse: res => ({
        results: res.completions.map(c => ({
          username: c.components.username.val,
          name: (c.components.full_name || {}).val,
          pic: c.thumbnail || 'http://placekitten.com/g/64/64',
        })),
      }),
    },
    fields: {
      title: 'name',
      description: 'username',
      image: 'pic',
    },
    minCharacters: 2,
    onSelect: async (user) => {
      tmplIns.$('.ui.search').addClass('loading')
      const entity = await Identity.getUsername(user.username, 'keybase')
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
