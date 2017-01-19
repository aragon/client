// @flow
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { dispatcher, actions } from '/client/lib/action-dispatcher'
import { bylawForAction } from '/client/lib/action-dispatcher/bylaws'
import ClosableSection from '/client/tmpl/components/closableSection'

const tmpl = Template.Module_Bylaws_Modify.extend([ClosableSection])

const showModal = (cb) => {
  this.$('.ui.modal').modal('show')
}

const triggerList = [
  'voting',
  'status',
  'specialStatus',
]

const statusList = [
  'none',
  'employee',
  'executive',
  'god',
]

const humanReadableTriggerTypes = {
  voting: 'A voting will be created',
  status: {
    none: 'Everyone will be able to change it',
    employee: 'Employees and executives will be able to change it',
    executive: 'Executives will be able to change it',
  },
  specialStatus: {
    shareholder: 'Shareholders will be able to change it',
  },
}

const setAction = () => {
  const action = actions[FlowRouter.getParam('key')]
  const completeAction = Object.assign(action, { bylaw: bylawForAction(action) })
  TemplateVar.set('action', completeAction)
  TemplateVar.set('selectedTrigger', triggerList[completeAction.bylaw.type])
}

tmpl.onCreated(setAction)

const save = function () {
  console.log(this)
  const signature = TemplateVar.get(this, 'action').signature
  console.log(signature)
  const trigger = TemplateVar.get(this, 'selectedTrigger')
  if (trigger === 'status') {
    const statusIndex: number = statusList.indexOf(this.$('[name="status"]').val())
    dispatcher.dispatch(actions.addStatusBylaw, signature, statusIndex)
    console.log('MANOLA')
    console.log(statusIndex)
  } else if (trigger === 'specialStatus') {
    dispatcher.dispatch(actions.addSpecialStatusBylaw, signature, 0)
  } else if (trigger === 'voting') {
    const supportNeeded = this.$('[name="supportNeeded"]').val()
    const closingRelativeMajority = this.$('[name="supportNeeded"]').is(':checked')
    const minimumVotingTime = parseInt(this.$('[name="minimumVotingTime"]').val(), 10) * 60 * 60 * 24
    console.log(supportNeeded)
    console.log(closingRelativeMajority)
    console.log(minimumVotingTime)
    dispatcher.dispatch(actions.addVotingBylaw, signature, supportNeeded, 100,
                        closingRelativeMajority, minimumVotingTime, 0)
  }
}

tmpl.onRendered(function () {
  this.$('.ui.modal').modal({
    inverted: true,
    // The callbacks are inverted since the recommended action is to cancel
    onApprove: () => {
      FlowRouter.reload()
    },
    onDeny: () => {
      console.log('Approved')
      save.call(this)
    },
  })

  this.$('.form').form({
    onSuccess: (e) => {
      e.preventDefault()
      showModal()
      return false
    },
  })

  const setStatusDropdown = () => {
    this.$('#status').dropdown()
  }

  const setVotingForm = () => {
    $('#closingRelativeMajority').checkbox()
  }

  const setTriggerDropdown = () => {
    this.$('#trigger').dropdown({
      onChange: (v) => {
        TemplateVar.set(this, 'selectedTrigger', v)
        requestAnimationFrame(() => {
          setStatusDropdown()
          setVotingForm()
        })
      },
    })
  }

  this.autorun(() => {
    FlowRouter.watchPathChange()
    setAction()
    requestAnimationFrame(() => {
      setTriggerDropdown()
      setStatusDropdown()
      setVotingForm()
    })
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
  }]),
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
  statusToInt: (status: string) => statusList.indexOf(status),
  action: () => TemplateVar.get('action'),
  selectedTrigger: () => TemplateVar.get('selectedTrigger'),
  secondsToDays: (seconds: number): number => seconds / 60 / 60 / 24,
  numbersToPercentage: (a: number, b: number): number => Math.round((a / b) * 100),
})
