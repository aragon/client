// @flow
import { TemplateVar } from 'meteor/frozeman:template-var'
import { Template } from 'meteor/templating'

import actions from '/client/lib/action-dispatcher/actions'
import { bylawForAction } from '/client/lib/action-dispatcher/bylaws'
import BylawsWatcher from '/client/lib/ethereum/bylaws'

const tmpl = Template.Module_Bylaws.extend()

tmpl.onRendered(function () {
  console.log(listBylawsActions())

  this.$('.ui.modal').modal({
    inverted: true,
    // The callbacks are inverted since the recommended action is to cancel
    onApprove: () => {
      console.log('Cancelled')
      BlazeLayout.reset()
    },
    onDeny: () => {
      console.log('Approved')
    },
  })

  setTimeout(showModal.bind(this), 1000)
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

const showModal = function () { this.$('.ui.modal').modal('show') }

const listBylawsActions = (): Array<Object> => {
  const humanizedActions = []
  const actionMap = new Map(Object.entries(actions))
  for (const action of actionMap.values()) {
    const bylaw: Object = bylawForAction(action)
    if (!bylaw) break
    humanizedActions.push({
      title: action.name,
      requirement: bylaw,
    })
  }
  return humanizedActions
}

console.log(neededStatusList)

tmpl.helpers({
  bylaws: () => listBylawsActions(),
  triggers: [{
    title: 'Requires a voting',
    value: 'voting'
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
})
