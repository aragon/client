// @flow
import { $ } from 'meteor/jquery'
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { FlowRouter } from 'meteor/kadira:flow-router'

import Identity from '/client/lib/identity'

const tmpl = Template.Module_Wallet.extend()

tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Wallet_Empty'),
  '/new': () => TemplateVar.set('rightSection', 'Module_Wallet_Send'),
  '/:address': () => TemplateVar.set('rightSection', 'Module_Entity'),
  '/*/entity/:address': () => TemplateVar.set('rightSection', 'Module_Entity'),
})

tmpl.onRendered(function () {
  this.$('table').tablesort()
})

tmpl.events({
  'input #searchInput': (e) => (TemplateVar.set('searchString', e.target.value)),
  'click tbody tr': (e) => FlowRouter.go(`/wallet/${$(e.currentTarget).data('recipient')}`),
})

tmpl.helpers({
  recipients: [{
    address: () => Identity.current(),
    type: 'Recurring',
  }],
})
