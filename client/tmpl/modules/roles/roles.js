// @flow
import { $ } from 'meteor/jquery'
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { FlowRouter } from 'meteor/kadira:flow-router'

import Identity from '/client/lib/identity'
// import StockWatcher from '/client/lib/ethereum/stocks'
// import { Stock } from '/client/lib/ethereum/contracts'

const tmpl = Template.Module_Roles.extend()

tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Roles_Empty'),
  '/assign': () => TemplateVar.set('rightSection', 'Module_Roles_Assign'),
  '/*/entity/:address': () => TemplateVar.set('rightSection', 'Module_Entity'),
})

tmpl.onCreated(() => {
})

tmpl.onRendered(function () {
  this.$('table').tablesort()
})

tmpl.events({
  'input #searchInput': (e) => (TemplateVar.set('searchString', e.target.value)),
  'click tbody tr': (e) => FlowRouter.go(`/roles/entity/${$(e.currentTarget).data('entity')}`),
})

window.id = Identity

tmpl.helpers({
  entities: Identity.Entities.find(),
})
