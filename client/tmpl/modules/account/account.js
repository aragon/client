const tmpl = Template.Module_Account.extend()

tmpl.onRendered(function () {
  this.autorun(() => {
    if (TemplateVar.get('viewAllAccounts')) {
      requestAnimationFrame(() => this.$('.dropdown').dropdown())
    }
  })
  this.$('#logout').popup({ position: 'top center' })
})

tmpl.events({
  'click #viewAllAccounts': () => {
    alert('If you change your account, you will have to re-link your identity and you will have to take care of past transactions incurred with your current Ethereum account.\nProceed carefully.')
    TemplateVar.set('viewAllAccounts', true)
  },
})

tmpl.helpers({
  accounts: () => EthAccounts.find(),
})
