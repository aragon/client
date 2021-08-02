import { getLocalStorageKey } from '../utils'

const getTemplateStateKey = networkType => getLocalStorageKey(`create-org`, networkType)

export function loadTemplateState(networkType) {
  const key = getTemplateStateKey(networkType)
  const value = localStorage.getItem(key)
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

export function saveTemplateState(networkType, state) {
  localStorage.setItem(getTemplateStateKey(networkType), JSON.stringify(state))
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
