const templateStateKey = 'create-org'

export function loadTemplateState() {
  const value = localStorage.getItem(templateStateKey)
  try {
    const data = JSON.parse(value)
    return {
      networkType: data.networkType,
      templateScreenIndex: data.templateScreenIndex,
      templateData: data.templateData || {},
      templateId: data.templateId,
    }
  } catch (err) {
    return {}
  }
}

export function saveTemplateState(state) {
  localStorage.setItem(templateStateKey, JSON.stringify(state))
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
