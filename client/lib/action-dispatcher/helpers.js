import { bylawForAction } from './bylaws'
import actions from './actions'

const callToActionForAction = (actionName: string): string => {
  const action = actions[actionName]
  const bylaw = bylawForAction(action)

  return bylaw.type === 0 ? `Create '${action.name}' voting` : action.name
}

const bylawDisclaimerForAction = (actionName: string): {title: string, description: string} => {
  const action = actions[actionName]
  const bylaw = bylawForAction(action)

  const title = bylaw.type === 0 ? `A voting will be needed to ${action.name}` : `${action.name} can be performed instantly`
  let description = ''

  const statusList = [
    'none',
    'employee',
    'executive',
    'god',
  ]

  const d = bylaw.details
  if (bylaw.type === 0) description = `Requires ${100 * d.supportNeeded / d.supportBase}% support in a ${d.minimumVotingTime / (24*3600)} day voting`
  if (bylaw.type === 1) description = `Requires ${statusList[d.neededStatus]} status in the company`
  if (bylaw.type === 2) description = 'Only shareholders can perform this action'

  return { title, description }
}

export { callToActionForAction, bylawDisclaimerForAction }
