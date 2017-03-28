import { bylawForAction } from './bylaws'
import actions from './actions'
import { Company } from '/client/lib/ethereum/deployed'
import { BylawsLib } from '/client/lib/ethereum/contracts'
import Status from '../identity/status'
import dispatcher from './dispatcher'

const callToActionForAction = (actionName: string): string => {
  if (!actionName) return ''

  const action = actions[actionName]
  const bylaw = bylawForAction(action)
  if (!bylaw) return ''

  return bylaw.type === 0 ? `Create '${action.name}' voting` : action.name
}

const bylawDisclaimerForAction = (actionName: string): {title: string, description: string} => {
  if (!actionName) return {}

  const action = actions[actionName]
  const bylaw = bylawForAction(action)
  if (!bylaw) return {}

  let title = ''
  let description = `${action.name} can be performed instantly`

  if (bylaw.type === 0) title = `A voting will be needed to ${action.name}`

  const d = bylaw.details

  if (bylaw.type === 0) description = `Requires ${Math.round(10000 * (d.supportNeeded / d.supportBase || 0)) / 100}% support in a ${d.minimumVotingTime / (24*3600)} day voting`
  if (bylaw.type === 1) title = `Requires ${Status.list[d.neededStatus]} status in the company`
  if (bylaw.type === 2) title = 'Only shareholders can perform this action'
  if (bylaw.type === 3) title = `Only a specific address can perform this action`
  if (bylaw.type === 4) title = 'An oracle is consulted for approving the action'

  return { title, description }
}

const canPerformAction = async (actionName: string): bool => {
  const action = actions[actionName]
  const bylaw = bylawForAction(action)
  // if (!bylaw) return false

  let checkingAction = action.signature
  if (bylaw.type === 0) {
    checkingAction = actions.beginPoll.signature
  }

  const bylawsLib = await BylawsLib.deployed()
  const actionSig = await bylawsLib.keyForFunctionSignature.call(checkingAction)
  const from = dispatcher.transactionParams.from

  const can = await Company().canPerformAction(actionSig, from, 0x0)
  console.log('check can perform', checkingAction, actionSig, from, can)
  return can
}

export { callToActionForAction, bylawDisclaimerForAction, canPerformAction }
