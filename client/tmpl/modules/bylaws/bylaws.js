// @flow
import { TemplateVar } from 'meteor/frozeman:template-var'
import { Template } from 'meteor/templating'

import actions from '/client/lib/action-dispatcher/actions'
import BylawsWatcher from '/client/lib/ethereum/bylaws'

const tmpl = Template.Module_Bylaws.extend()

tmpl.onRendered(function () {
  listBylawsActions()

  $('.ui.modal').modal({
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

const neededStatus = {
  status: {
    0: 'none',
    1: 'employee',
    2: 'executive',
    3: 'god',
  },
  specialStatus: {
    0: 'shareholder',
    1: 'stockSale',
  },
}

type NeededStatus = $Keys<typeof neededStatus>

const triggerEnum = {
  0: 'voting',
  1: 'status',
  2: 'specialStatus',
}

type TriggerType = $Keys<typeof triggerEnum>

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

const bylawToHuman: string = (bylaw: Object) => {
  console.log(humanReadableTriggerTypes[triggerEnum[bylaw.type]])
}

const showModal = () => {
  this.$('.ui.modal').modal('show')
}

const listBylawsActions = () => {
  const bylaws = BylawsWatcher.Bylaws.find({ signature: { $in: Object.keys(actionsObj) } }).fetch()
  const bylawsObj: Object = Object.assign(...bylaws.map(bylaw => ({ [bylaw.signature]: bylaw })))

  const humanizedActions = []
  for (const action of actions) {
    humanizedActions.push({
      title: action.name,
      requirement: bylawToHuman(bylawsObj[action.signature])
    })
  }
  return humanizedActions
}

tmpl.helpers({
  bylaws: listBylawsActions(),
})
