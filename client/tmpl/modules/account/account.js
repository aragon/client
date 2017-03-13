// @flow
import { TemplateVar } from 'meteor/frozeman:template-var'
import { EthAccounts } from 'meteor/ethereum:accounts'
import { Template } from 'meteor/templating'

import Identity from '/client/lib/identity'
import Settings from '/client/lib/settings'
import currencies from './currencies'

const tmpl = Template.Module_Account.extend()

tmpl.onRendered(function () {
  this.$('#logout').popup({ position: 'top center' })
  this.$('#viewAllAccounts, #linkKeybase, #unlinkCompany').popup({ position: 'bottom center' })
  this.$('[name="currency"]').dropdown({
    fullTextSearch: true,
    onChange: cur => Settings.set('displayCurrency', cur),
  })

  this.autorun(() => {
    if (TemplateVar.get('viewAllAccounts')) {
      requestAnimationFrame(() => {
        this.$('.dropdown').dropdown({
          onChange: (val) => {
            Identity.setCurrentEthereumAccount(val)
            TemplateVar.set(this, 'viewAllAccounts', false)
          },
        })
      })
      // Handling the case of a Keybase Eth keypair not loaded
      const addresses = EthAccounts.find().fetch().map(x => x.address)
      if (addresses.indexOf(Identity.current().ethereumAddress) === -1) {
        Identity.setCurrentEthereumAccount(addresses[0])
      }
    }
  })
})

tmpl.events({
  'click #viewAllAccounts': () => TemplateVar.set('viewAllAccounts', true),
  'click #unlinkIdentity': () => {
    const entity = Identity.current()
    Identity.setCurrent({
      identityProvider: 'anon',
      ethereumAddress: entity.ethereumAddress,
      data: {},
    })
    },
    'click #unlinkCompany': () => {
      localStorage.clear()
      location.reload()
    },
    'click #linkKeybase': async () => {
      if (confirm('Do you have the Keybase app installed?')) {
        Identity.linkCurrent('keybase')
      } else if (confirm('Do you want to install it?')) {
        window.open('https://keybase.io/download')
      }
    },
})

tmpl.helpers({
  accounts: () => EthAccounts.find(),
  currencies: () => (
    Object.keys(currencies).map((symbol) => ({ name: currencies[symbol], symbol }))
  ),
  companyAddress: () => localStorage.getItem('companyAddress')
})
