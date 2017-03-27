// @flow
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { dispatcher, actions } from '/client/lib/action-dispatcher'
import { bylawForAction } from '/client/lib/action-dispatcher/bylaws'
import Status from '/client/lib/identity/status'
import ClosableSection from '/client/tmpl/components/closableSection'
import Identity from '/client/lib/identity'

const tmpl = Template.Module_Bylaws_Modify.extend([ClosableSection])

const triggerList = [
  'voting',
  'status',
  'specialStatus',
  'address',
  'oracle',
]

const setAction = async () => {
  const action = actions[FlowRouter.getParam('key')]
  const completeAction = Object.assign(action, { bylaw: bylawForAction(action) })
  TemplateVar.set('action', completeAction)
  TemplateVar.set('selectedTrigger', triggerList[completeAction.bylaw.type])

  const bylaw = completeAction.bylaw
  if (bylaw.type > 2) {
    TemplateVar.setTo('.identityAutocomplete', 'entity', await Identity.lookupAndFormat(bylaw.details.address))
  }
}

tmpl.onCreated(setAction)

const save = function () {
  const signature = TemplateVar.get(this, 'action').signature
  const trigger = TemplateVar.get(this, 'selectedTrigger')
  if (trigger === 'status') {
    const statusIndex: number = Status.toNumber(this.$('[name="status"]').val())
    dispatcher.dispatch(actions.setStatusBylaw, signature, statusIndex, false)
  } else if (trigger === 'specialStatus') {
    dispatcher.dispatch(actions.setStatusBylaw, signature, 0, true)
  } else if (trigger === 'voting') {
    const supportNeeded = this.$('[name="supportNeeded"]').val()
    const closingRelativeMajority = this.$('[name="supportNeeded"]').is(':checked')
    const minimumVotingTime = parseInt(this.$('[name="minimumVotingTime"]').val(), 10) * 60 * 60 * 24
    dispatcher.dispatch(actions.setVotingBylaw, signature, supportNeeded, 100,
                        closingRelativeMajority, minimumVotingTime, 0)
  } else if (trigger === 'address' || trigger === 'oracle') {
    const isOracle = trigger === 'oracle'
    const addrBylaw = TemplateVar.get(this, 'addrBylaw')

    console.log('the addr', addrBylaw)
    dispatcher.dispatch(actions.setAddressBylaw, signature, addrBylaw, isOracle)
  }
}

const confirmText =
`Changing your company's bylaws has real implications on its functioning.\n
Please make sure this is a desired action.\n
Your company may become locked for ever after a bad change`

tmpl.onRendered(async function () {
  this.$('.form').form({
    onSuccess: (e) => {
      e.preventDefault()
      if (confirm(confirmText)) save.call(this)
      return false
    },
  })

  this.autorun(async () => {
    FlowRouter.watchPathChange()
    await setAction()
    TemplateVar.set(this, 'addrBylaw', TemplateVar.get(this, 'action').bylaw.details.address)
    requestAnimationFrame(() => (this.$('#closingRelativeMajority').checkbox()))
  })
})

tmpl.helpers({
  triggers: (action) => ([{
    title: 'Requires a voting',
    value: 'voting',
    disabled: (action.key === 'beginPoll' || action.key === 'castVote') ? 'disabled' : null,
  }, {
    title: 'Requires a user with status',
    value: 'status',
  }, {
    title: 'Requires a shareholder',
    value: 'specialStatus',
  }, {
    title: 'Only a specific address can perform it',
    value: 'address',
  }, {
    title: 'An oracle will be called for confirmation (advanced)',
    value: 'oracle',
  },
]),
  triggerToInt: (trigger: string) => triggerList.indexOf(trigger),
  intToTrigger: (trigger: number) => triggerList[trigger],
  statuses: [{
    value: 'none',
    title: 'Everyone will be able to change it',
  }, {
    value: 'employee',
    title: 'Employees and executives will be able to change it',
  }, {
    value: 'executive',
    title: 'Executives will be able to change it',
  }],
  statusToInt: status => Status.toNumber(status),
  action: () => TemplateVar.get('action'),
  selectedTrigger: () => TemplateVar.get('selectedTrigger'),
  secondsToDays: (seconds: number): number => seconds / 60 / 60 / 24,
  numbersToPercentage: (a: number, b: number): number => Math.round((a / b) * 100),
  actionName: () => {
    const trigger = TemplateVar.get('selectedTrigger')
    if (trigger === 'voting') return 'setVotingBylaw'
    if (trigger === 'address' || trigger === 'oracle') return 'setAddressBylaw'
    return 'setStatusBylaw'
  }
})

tmpl.events({
  'change #trigger': (e) => {
    TemplateVar.set('selectedTrigger', e.target.value)
    requestAnimationFrame(() => {
      this.$('#closingRelativeMajority').checkbox()
    })
  },
  'select .identityAutocomplete': (e, instance, user) => {
    TemplateVar.set('addrBylaw', user.ethereumAddress)
  },
})
