// @flow
import { Template } from 'meteor/templating'

import ClosableSection from '/client/tmpl/components/closableSection'

const tmpl = Template.Module_Rewards_New.extend([ClosableSection])

tmpl.onRendered(function () {
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      this.$('.dimmer').trigger('loading')

      this.$('.dimmer').trigger('finished', { state: 'success' })
      return false
    },
  })
})

tmpl.events({
  'select .identityAutocomplete': (e, instance, user) => (TemplateVar.set('recipient', user)),
  'success .dimmer': () => FlowRouter.go('/rewards'),
  'click #recurrent': () => TemplateVar.set('isRecurrent', !TemplateVar.get('isRecurrent')),
})
