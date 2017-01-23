// @flow
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { TemplateVar } from 'meteor/frozeman:template-var'
import Identity from '/client/lib/identity'
import Status from '/client/lib/identity/status'

import ClosableSection from '/client/tmpl/components/closableSection'
import { dispatcher, actions } from '/client/lib/action-dispatcher'

const tmpl = Template.Module_Roles_Assign.extend([ClosableSection])

tmpl.onCreated(function () {
  const setEntity = async () => {
    if (FlowRouter.getParam('address')) {
      const entity = await Identity.get(FlowRouter.getParam('address'))
      TemplateVar.set(this, 'entity', entity)
    } else {
      TemplateVar.set(this, 'entity', undefined)
    }
  }

  this.autorun(() => {
    FlowRouter.watchPathChange()
    setEntity()
  })
  setEntity()
})

tmpl.onRendered(function () {
  TemplateVar.set('assignMode', true)

  this.$('.dropdown').dropdown({
    onChange: (v) => TemplateVar.set(this, 'selectedStatus', +v),
  })
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      this.$('.dimmer').trigger('loading')

      this.$('.dimmer').trigger('finished', { state: 'success' })
      return false
    },
  })
})

tmpl.helpers({
  statuses: Status.list,
})

tmpl.events({
  'select .identityAutocomplete': (e, instance, user) => (TemplateVar.set('recipient', user)),
  'success .dimmer': () => FlowRouter.go('/ownership'),
  'click #stockGrant': () => TemplateVar.set('assignMode', !TemplateVar.get('assignMode')),
})
