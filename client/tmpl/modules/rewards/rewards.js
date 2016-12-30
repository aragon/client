// @flow
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { FlowRouter } from 'meteor/kadira:flow-router'

import Identity from '/client/lib/identity'

const tmpl = Template.Module_Rewards.extend()

tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Rewards_Empty'),
  '/new': () => TemplateVar.set('rightSection', 'Module_Rewards_New'),
  '/:address': () => TemplateVar.set('rightSection', 'Module_Entity'),
})

tmpl.onRendered(function () {
  this.$('table').tablesort()
})

tmpl.events({
  'input #searchInput': (e) => (TemplateVar.set('searchString', e.target.value)),
  'click tbody tr': (e) => FlowRouter.go(`/rewards/${$(e.currentTarget).data('recipient')}`),
})

tmpl.helpers({
  recipients: [{
    address: Identity.current(),
    type: 'Recurrent',
  }],
})
