const tmpl = Template.Module_Fundraising.extend()

tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Fundraising_Empty'),
  '/new': () => TemplateVar.set('rightSection', 'Module_Fundraising_New'),
  '/new/individual': () => TemplateVar.set('rightSection', 'Module_Fundraising_New_Individual'),
  '/:id': () => TemplateVar.set('rightSection', 'Module_Fundraising_Info'),
})

tmpl.onCreated(() => {
  TemplateVar.set('rightSection', 'Module_Fundraising_Empty')
})

tmpl.events({
  'input #searchInput': (e) => (TemplateVar.set('searchString', e.target.value)),
  'click tbody tr': (e) => FlowRouter.go(`/fundraising/${$(e.currentTarget).data('id')}`),
})

tmpl.helpers({
  raises: [
    {
      name: 'Seed round',
      amount: 1000,
      ending: moment().subtract(1, 'year').toDate(),
    },
    {
      name: 'Series A',
      amount: 100000,
      ending: moment().add(1, 'month').toDate(),
    },
  ],
})
