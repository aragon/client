// @flow
import { Txid } from './contracts'

const verifyContractCode = async (address: string, candidateContracts) => {
  const contract = Txid.at(address)

  const txid = await contract.txid.call()
  if (!txid) { return null }

  if (contract.address !== web3.eth.getTransactionReceipt(txid).contractAddress) {
    return null
  }

  const bytecode = web3.eth.getTransaction(txid).input

  for (const c of candidateContracts) {
    if (bytecode.indexOf(c.binary) === 0) { // Account for constructor values at end of input
      return c
    }
  }

  return null
}

export default verifyContractCode
