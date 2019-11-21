import { network, web3Providers } from '../environment'
import { getWeb3 } from '../web3-utils'
import { log } from '../utils'

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

export function prepareTransactionCreatorFromAbi(abi, toAddress) {
  const web3 = getWeb3(web3Providers.default)
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

export async function getGasPrice() {
  const web3 = getWeb3(web3Providers.default)
  try {
    const response = await fetch(
      'https://ethgasstation.info/json/ethgasAPI.json',
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
      }
    )
    const jsonResponse = await response.json()
    const priceInWei = web3.utils.toWei(
      jsonResponse.gasPriceRange[40].toString(), // using '40' as a safe price, this should be set via user input
      'gwei'
    )
    return priceInWei
  } catch (e) {
    log('Error fetching gas price: ', e)
  }
  const priceInWei = web3.utils.toWei('2', 'gwei') // If we can't fetch a price default to 2 gwei
  return priceInWei
}
