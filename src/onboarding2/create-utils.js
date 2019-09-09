import { network } from '../environment'

const TEMPLATE_STATE_KEY = `create-org:${network.type}`

export function loadTemplateState() {
  const value = localStorage.getItem(TEMPLATE_STATE_KEY)
  try {
    const data = JSON.parse(value)
    return {
      templateScreenIndex: data.templateScreenIndex,
      templateData: data.templateData || {},
      templateId: data.templateId,
    }
  } catch (err) {
    return {}
  }
}

export function saveTemplateState(state) {
  localStorage.setItem(`create-org:${network.type}`, JSON.stringify(state))
}
