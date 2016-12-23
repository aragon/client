import Identity from '/client/lib/identity'

const tmpl = Template.Module_Account.extend()

tmpl.onRendered(function () {
  this.$('#logout').popup({ position: 'top center' })
  this.$('#viewAllAccounts').popup({ position: 'bottom center' })

  this.autorun(() => {
    if (TemplateVar.get('viewAllAccounts')) {
      requestAnimationFrame(() => {
        this.$('.dropdown').dropdown({
          onChange: (val) => {
            console.log(val)
            Identity.setCurrentEthereumAccount(val)
          },
        })
      })
    }
  })
})

tmpl.events({
  'click #viewAllAccounts': () => TemplateVar.set('viewAllAccounts', true),
})

tmpl.helpers({
  accounts: () => EthAccounts.find(),
})
