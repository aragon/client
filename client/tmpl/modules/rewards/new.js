// @flow
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { TemplateVar } from 'meteor/frozeman:template-var'

import Shake from '/client/lib/shake'

import ClosableSection from '/client/tmpl/components/closableSection'

const tmpl = Template.Module_Rewards_New.extend([ClosableSection])

tmpl.onCreated(function () {
  TemplateVar.set('isVirtualCard', true)
})

tmpl.onRendered(function () {
  this.$('.form').form({
    onSuccess: async (e) => {
      if (TemplateVar.get(this, 'anonDebitCard')) {
        console.log(Shake.fakeUser())
      }

      e.preventDefault()
      this.$('.dimmer').trigger('loading')

      this.$('.dimmer').trigger('finished', { state: 'success' })
      return false
    },
  })

  this.autorun(() => {
    if (TemplateVar.get('isCard')) {
      requestAnimationFrame(() => {
        this.$('.dropdown').dropdown({
          onChange: (v) => {
            TemplateVar.set(this, 'isVirtualCard', v === 'virtual')
          },
        })
        this.$('#anonDebitCard').checkbox({
          onChange: () => (
            TemplateVar.set(this, 'anonDebitCard', this.$('#anonDebitCard input').prop('checked'))
          ),
        })
      })
    }
  })
})

tmpl.events({
  'select .identityAutocomplete': (e, instance, user) => (TemplateVar.set('recipient', user)),
  'success .dimmer': () => FlowRouter.go('/rewards'),
  'click #recurrent': () => TemplateVar.set('isRecurrent', !TemplateVar.get('isRecurrent')),
  'click #debitCard': () => TemplateVar.set('isCard', !TemplateVar.get('isCard')),
})
