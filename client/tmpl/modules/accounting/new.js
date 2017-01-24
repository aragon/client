// @flow
import { $ } from 'meteor/jquery'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { ReactivePromise } from 'meteor/deanius:promise'
import { moment } from 'meteor/momentjs:moment'

import { Company } from '/client/lib/ethereum/deployed'
import { dispatcher, actions } from '/client/lib/action-dispatcher'

import ClosableSection from '/client/tmpl/components/closableSection'

const tmpl = Template.Module_Accounting_New.extend([ClosableSection])

tmpl.helpers({
  remainingBudget: ReactivePromise(Company.getAccountingPeriodRemainingBudget.call),
  periodCloses: ReactivePromise(() =>
                  Company.getAccountingPeriodCloses.call().then(x => moment(x * 1000))),
  actionName: () => (TemplateVar.get('isRecurring') ? 'createRecurringReward' : 'issueReward'),
})

const issueReward = (to, amountWei) => (
  dispatcher.dispatch(actions.issueReward, to, amountWei, `Reward for ${to}`)
)

const createRecurringReward = (to, amountWei, period) => (
  dispatcher.dispatch(actions.createRecurringReward, to, amountWei, period, `Recurring reward for ${to}`)
)

tmpl.onRendered(function () {
  this.$('.dropdown').dropdown()
  this.$('.form').form({
    onSuccess: async (e) => {
      e.preventDefault()
      this.$('.dimmer').trigger('loading')

      const amount = TemplateVar.getFrom('.Element_CurrencyAmount', 'amountWei')

      const to = TemplateVar.get(this, 'recipient').ethereumAddress

      try {
        if (TemplateVar.get(this, 'isRecurring')) {
          const periodNumber = this.$('input[name=periodNumber]').val()
          const periodUnit = $('#recurringPeriodInterval').dropdown('get value')
          await createRecurringReward(to, amount, periodNumber * periodUnit)
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
    if (TemplateVar.get('isRecurring')) {
      requestAnimationFrame(() => {
        this.$('#recurringPeriodInterval').dropdown()
      })
    }
  })
})

tmpl.events({
  'select .identityAutocomplete': (e, instance, user) => (TemplateVar.set('recipient', user)),
  'success .dimmer': () => FlowRouter.go('/rewards'),
  'click #recurring': () => TemplateVar.set('isRecurring', !TemplateVar.get('isRecurring')),
})
