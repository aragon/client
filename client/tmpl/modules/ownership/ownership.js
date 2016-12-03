Template.module_ownership.created = () => {
  TemplateVar.set('rightSection', 'module_ownershipEmpty')
}

Template.module_ownership.events({
  'click button#issueShares': () => (TemplateVar.set('rightSection', 'module_ownershipIssueShares')),
  'click button#assignShares': () => (TemplateVar.set('rightSection', 'module_ownershipAssignShares')),
})

Template.module_ownership.helpers({
  rightSection: () => (TemplateVar.get('rightSection')),
  context: () => ({ parent: Template.instance() }),
  shareholders: () => ([
    {
      name: 'Manolo',
      kind: 'With voting rights',
      shares: 9000,
    },
  ]),
})
