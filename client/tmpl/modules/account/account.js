const tmpl = Template.Module_Account.extend()

tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Account_Empty'),
  '/entity/:address': () => TemplateVar.set('rightSection', 'Module_Entity'),
})

tmpl.onRendered(function () {
  this.$('.ui.dropdown').dropdown()
  this.$('#logout').popup({ position: 'top center' })
})

tmpl.helpers({
  accounts: () => EthAccounts.find(),
})
