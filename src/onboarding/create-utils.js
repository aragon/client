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

export function prepareTransactionCreatorFromAbi(web3, abi, toAddress) {
  const contract = new web3.eth.Contract(abi)

  return function(methodName, paramsList) {
    const method = contract.methods[methodName]
    if (!method) {
      throw new Error(
        `Could not create transaction: no method found on ABI for ${methodName}`
      )
    }

    return {
      data: method(...paramsList).encodeABI(),
      to: toAddress,
    }
  }
}
