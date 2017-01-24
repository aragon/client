// @flow
import { $ } from 'meteor/jquery'
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { FlowRouter } from 'meteor/kadira:flow-router'

import Identity from '/client/lib/identity'
import Accounting from '/client/lib/ethereum/accounting'

const tmpl = Template.Module_Accounting.extend()

tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Accounting_Empty'),
  '/payments/new': () => TemplateVar.set('rightSection', 'Module_Accounting_New'),
  '/transactions/:id': () => TemplateVar.set('rightSection', 'Module_Accounting_Details'),
  '/*/entity/:address': () => TemplateVar.set('rightSection', 'Module_Entity'),
})

tmpl.onRendered(function () {
  this.$('table').tablesort()
})

tmpl.events({
  'input #searchInput': (e) => (TemplateVar.set('searchString', e.target.value)),
  'click tbody tr': (e) => FlowRouter.go(`/accounting/transactions/${$(e.currentTarget).data('transaction')}`),
})

window.Accounting = Accounting

tmpl.helpers({
  transactions: Accounting.Transactions.find(),
  recipients: [{
    address: () => Identity.current(),
    type: 'Recurring',
  }],
})
