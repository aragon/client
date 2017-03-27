import { bylawForAction } from './bylaws'
import actions from './actions'
import Status from '../identity/status'

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

  const title = bylaw.type === 0 ? `A voting will be needed to ${action.name}` : `${action.name} can be performed instantly`
  let description = ''

  const d = bylaw.details

  if (bylaw.type === 0) description = `Requires ${Math.round(10000 * (d.supportNeeded / d.supportBase || 0)) / 100}% support in a ${d.minimumVotingTime / (24*3600)} day voting`
  if (bylaw.type === 1) description = `Requires ${Status.list[d.neededStatus]} status in the company`
  if (bylaw.type === 2) description = 'Only shareholders can perform this action'

  return { title, description }
}

export { callToActionForAction, bylawDisclaimerForAction }
