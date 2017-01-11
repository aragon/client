// @flow
import web3 from '/client/lib/ethereum/web3'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { ReactivePromise } from 'meteor/deanius:promise'
import { moment } from 'meteor/momentjs:moment'

import Identity from '/client/lib/identity'
import Shake from '/client/lib/shake'
import Company from '/client/lib/ethereum/deployed'

import ClosableSection from '/client/tmpl/components/closableSection'

const tmpl = Template.Module_Rewards_New.extend([ClosableSection])

tmpl.onCreated(function () {
  TemplateVar.set('isVirtualCard', true)
  TemplateVar.get('anonDebitCard', true)
})

tmpl.helpers({
  remainingBudget: ReactivePromise(Company.getAccountingPeriodRemainingBudget.call),
  periodCloses: ReactivePromise(() =>
                  Company.getAccountingPeriodCloses.call().then(x => moment(x * 1000))),
})

const issueReward = (to, amount) => {
  const address = Identity.current(true).ethereumAddress
  return Company.issueReward(to, web3.toWei(amount, 'ether'), `Reward for ${to}`, { from: address, gas: 4000000 })
}

const createRecurringReward = (to, amount, periodDays) => {
  const address = Identity.current(true).ethereumAddress
  return Company.createRecurringReward(to, web3.toWei(amount, 'ether'), periodDays * 3600 * 24, `Recurring reward for ${to}`, { from: address, gas: 4000000 })
}

tmpl.onRendered(function () {
  this.$('.dropdown').dropdown()
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      this.$('.dimmer').trigger('loading')

      const amount = parseFloat(this.$('input[name=rewardAmount]').val())

      if (TemplateVar.get(this, 'anonDebitCard')) {
        const debitCardCurrency = this.$('#debitCardCurrency input').val()
        const shakeUser = Shake.fakeUser(debitCardCurrency)
        console.log(shakeUser)
        const user = await Shake.createUser(shakeUser)
        console.log(user)
        const invoice = await Shake.createInvoice({
          email: shakeUser.user.email,
          currency: shakeUser.card.currency,
          amount
        })
        console.log(invoice)
      }

      return

      const to = TemplateVar.get(this, 'recipient').ethereumAddress

      try {
        if (TemplateVar.get(this, 'isRecurrent')) {
          const periodDays = this.$('input[name=period]').val()
          await createRecurringReward(to, amount, periodDays)
        } else {
          await issueReward(to, amount)
        }

        this.$('.dimmer').trigger('finished', { state: 'success' })
      } catch (error) {
        console.log(error)
        this.$('.dimmer').trigger('finished', { state: 'failure' }) // TODO: failure state
      }

      return false
    },
  })

  this.autorun(() => {
    if (TemplateVar.get('isCard')) {
      requestAnimationFrame(() => {
        this.$('#debitCardCurrency').dropdown()
        this.$('#debitCardType').dropdown({
          onChange: v => TemplateVar.set(this, 'isVirtualCard', v === 'virtual'),
        })
        this.$('#anonDebitCard').checkbox({
          onChange: () => (
            TemplateVar.set(this, 'anonDebitCard', this.$('#anonDebitCard input').prop('checked'))
          ),
        })
      })
    } else if (TemplateVar.get('isRecurrent')) {
      requestAnimationFrame(() => {
        this.$('#recurrentPeriodInterval').dropdown()
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
