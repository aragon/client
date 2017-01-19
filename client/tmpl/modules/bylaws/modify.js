// @flow
import { TemplateVar } from 'meteor/frozeman:template-var'
import { Template } from 'meteor/templating'

import ActionFactory from '/client/lib/action-dispatcher/actions'
import { bylawForAction } from '/client/lib/action-dispatcher/bylaws'
import BylawsWatcher from '/client/lib/ethereum/bylaws'
import ClosableSection from '/client/tmpl/components/closableSection'

const tmpl = Template.Module_Bylaws_Modify.extend([ClosableSection])

let changeCb: Function = () => {}

const showModal = function (cb) {
  changeCb = cb
  this.$('.ui.modal').modal('show')
}

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

  this.$('.ui.dropdown').dropdown({
    onChange: function (v, e, b) {
      console.log(this)
      console.log(v)
      console.log(b)
      showModal(() => {
        console.log('MANOLA')
      })
    },
  })
})

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

tmpl.helpers({
  triggers: [{
    title: 'Requires a voting',
    value: 'voting',
  },
  {
    title: 'Requires a user with status',
    value: 'status',
  },
  {
    title: 'Requires a shareholder',
    value: 'specialStatus',
  }],
  triggerToInt: (trigger: string) => triggerEnum.indexOf(trigger),
  statuses: neededStatusList,
  statusToInt: (status: string) => neededStatusList.indexOf(status),
  action: () => {
    const action = ActionFactory[FlowRouter.getParam('key')]
    console.log(action)
    console.log(bylawForAction(action))
    return Object.assign(action, { bylaw: bylawForAction(action) })
  },
})
