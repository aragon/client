// @flow
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { FlowRouter } from 'meteor/kadira:flow-router'

import ActionFactory from '/client/lib/action-dispatcher/actions'
import Dispatcher from '/client/lib/action-dispatcher/dispatcher'
import { bylawForAction } from '/client/lib/action-dispatcher/bylaws'
import BylawsWatcher from '/client/lib/ethereum/bylaws'
import ClosableSection from '/client/tmpl/components/closableSection'

const tmpl = Template.Module_Bylaws_Modify.extend([ClosableSection])

let changeCb: Function = () => {}

const showModal = function (cb) {
  changeCb = cb
  this.$('.ui.modal').modal('show')
}

const triggerEnum = [
  'voting',
  'status',
  'specialStatus',
]

const neededStatus = {
  status: [
    'none',
    'employee',
    'executive',
    'god',
  ],
  specialStatus: [
    'shareholder',
    'stockSale',
  ],
}

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

const neededStatusObj = Object.assign(humanReadableTriggerTypes.status,
                                      humanReadableTriggerTypes.specialStatus)
const neededStatusList = Object.keys(neededStatusObj).map((k) => ({
  title: neededStatusObj[k],
  value: k,
}))

const bylawToHuman = (bylaw: Object): string => {
  let humanStr = ''
  const triggerType = triggerEnum[bylaw.type]
  const triggerStatus = neededStatus[triggerType]
  if (bylaw.details.neededStatus) {
    const triggerStatus = neededStatus[triggerType][bylaw.details.neededStatus]
    humanStr = humanReadableTriggerTypes[triggerType][triggerStatus]
  } else {
    humanStr = humanReadableTriggerTypes[triggerType]
  }
  console.log(humanStr)
  return humanStr
}

const setAction = () => {
  const action = ActionFactory[FlowRouter.getParam('key')]
  const completeAction = Object.assign(action, { bylaw: bylawForAction(action) })
  TemplateVar.set('action', completeAction)
  console.log(completeAction)
  TemplateVar.set('selectedTrigger', triggerEnum[completeAction.bylaw.type])
}

tmpl.onCreated(setAction)

tmpl.onRendered(function () {
  this.$('.ui.modal').modal({
    inverted: true,
    // The callbacks are inverted since the recommended action is to cancel
    onApprove: () => {
      console.log('Cancelled')
      BlazeLayout.reset()
    },
    onDeny: () => {
      console.log('Approved')
      changeCb()
    },
  })

  const setStatusDropdown = () => {
    this.$('#status').dropdown({
      onChange: (v) => {
        console.log(v)
        showModal(() => {
          const signature = TemplateVar.get('action').signature
          const statusIndex = neededStatus.status.indexOf(v)
          Dispatcher.dispatch(ActionFactory.addStatusBylaw, signature, statusIndex)
          console.log('MANOLA')
          console.log(signature)
          console.log(statusIndex)
        })
      },
    })
  }

  const setTriggerDropdown = () => {
    this.$('#trigger').dropdown({
      onChange: (v) => {
        TemplateVar.set(this, 'selectedTrigger', v)
        console.log(v)
        if (v === 'status') {
          requestAnimationFrame(() => setStatusDropdown())
        } else {
          showModal(() => {
            Dispatcher.dispatch(TemplateVar.get(this, 'action'), params)
            console.log('MANOLA')
          })
        }
      },
    })
  }

  this.autorun(() => {
    FlowRouter.watchPathChange()
    setAction()
    requestAnimationFrame(() => {
      setTriggerDropdown()
      setStatusDropdown()
    })
  })
})

tmpl.helpers({
  triggers: (action) => {
    console.log(action)
    return [{
    title: 'Requires a voting',
    value: 'voting',
    disabled: (action.key === 'beginPoll' || action.key === 'castVote') ? 'disabled' : null,
  }, {
    title: 'Requires a user with status',
    value: 'status',
  }, {
    title: 'Requires a shareholder',
    value: 'specialStatus',
  }]},
  triggerToInt: (trigger: string) => triggerEnum.indexOf(trigger),
  intToTrigger: (trigger: number) => triggerEnum[trigger],
  statuses: neededStatusList,
  statusToInt: (status: string) => neededStatusList.indexOf(status),
  action: () => TemplateVar.get('action'),
  selectedTrigger: () => TemplateVar.get('selectedTrigger'),
})
