// @flow

import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { moment } from 'meteor/momentjs:moment'
import { ReactivePromise } from 'meteor/deanius:promise'

import ClosableSection from '/client/tmpl/components/closableSection'
import Identity from '/client/lib/identity'
import Accounting from '/client/lib/ethereum/accounting'

import { dispatcher, actions } from '/client/lib/action-dispatcher'

const tmpl = Template.Module_Accounting_Details.extend([ClosableSection])

tmpl.onCreated(() => {
  TemplateVar.set('transaction', Accounting.Transactions.findOne(
    { transactionIndex: +FlowRouter.getParam('id') }))
})

tmpl.events({
  'click #stopRecurring': async () => {
    this.$('.dimmer').trigger('loading')
    await dispatcher.dispatch(actions.removeRecurringReward, +FlowRouter.getParam('id'))
    this.$('.dimmer').trigger('success')
  },
})
