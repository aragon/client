// @flow
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { TemplateVar } from 'meteor/frozeman:template-var'
import Identity from '/client/lib/identity'
import Status from '/client/lib/identity/status'

import ClosableSection from '/client/tmpl/components/closableSection'
import { dispatcher, actions } from '/client/lib/action-dispatcher'

const tmpl = Template.Module_Roles_Assign.extend([ClosableSection])

tmpl.onCreated(async function () {
  if (FlowRouter.getParam('address')) {
    const entity = await Identity.get(FlowRouter.getParam('address'))
    TemplateVar.set(this, 'entity', entity)
  } else {
    TemplateVar.set(this, 'entity', undefined)
  }
})

tmpl.onRendered(function () {
  TemplateVar.set('assignMode', true)

  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      this.$('.dimmer').trigger('loading')

      const addr: string = TemplateVar.get(this, 'entity').ethereumAddress
      const status: number = TemplateVar.get(this, 'selectedStatus')
      await dispatcher.dispatch(actions.setEntityStatus, addr, status)

      this.$('.dimmer').trigger('finished', { state: 'success' })
      return false
    },
  })
})

tmpl.helpers({
  statuses: Status.list,
})

tmpl.events({
  'select .identityAutocomplete': (e, instance, user) => (TemplateVar.set('entity', user)),
  'change select': (e) => (
    TemplateVar.set(this, 'selectedStatus', Status.toNumber(e.target.value))
  ),
  'success .dimmer': () => FlowRouter.go('/roles'),
})
