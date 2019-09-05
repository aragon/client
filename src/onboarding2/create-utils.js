import { network } from '../environment'

export function loadTemplateState() {
  const value = localStorage.getItem(`create-org:${network.type}`)
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
