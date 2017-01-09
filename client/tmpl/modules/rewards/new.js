// @flow
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { TemplateVar } from 'meteor/frozeman:template-var'

import Identity from '/client/lib/identity'
import Shake from '/client/lib/shake'
import Company from '/client/lib/ethereum/deployed'

import ClosableSection from '/client/tmpl/components/closableSection'

const tmpl = Template.Module_Rewards_New.extend([ClosableSection])

tmpl.onCreated(function () {
  TemplateVar.set('isVirtualCard', true)
})

tmpl.helpers({
  remainingBudget: ReactivePromise(Company.getAccountingPeriodRemainingBudget.call),
  periodCloses: ReactivePromise(() => Company.getAccountingPeriodCloses.call().then(x => moment(x * 1000))),
})

const issueReward = (to, amount) => {
  console.log('issueing', to, amount)
  const address = Identity.current(true).ethereumAddress
  return Company.issueReward(to, web3.toWei(amount, 'ether'), `Reward for ${to}`, { from: address, gas: 4000000 })
}

tmpl.onRendered(function () {
  this.$('.form').form({
    onSuccess: async (e) => {
      if (TemplateVar.get(this, 'anonDebitCard')) {
        console.log(Shake.fakeUser())
      }

      e.preventDefault()
      this.$('.dimmer').trigger('loading')

      const amount = $('input[name=rewardAmount]').val()
      const to = TemplateVar.get(this, 'recipient').ethereumAddress

      try {
        await issueReward(to, amount)
        this.$('.dimmer').trigger('finished', { state: 'success' })
      } catch (error) {
        this.$('.dimmer').trigger('finished', { state: 'failure' }) // TODO: failure state
      }

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
