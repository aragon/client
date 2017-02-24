// @flow
import { Txid } from './contracts'

const getReceipt = txid => {
  return new Promise((resolve, reject) => {
    web3.eth.getTransactionReceipt(txid, (err, tx) => {
      if (err) reject(err)
      resolve(tx)
    })
  })
}

const getTx = txid => {
  return new Promise((resolve, reject) => {
    web3.eth.getTransaction(txid, (err, tx) => {
      if (err) reject(err)
      resolve(tx)
    })
  })
}

const verifyBytecode = (bytecode, candidateContracts) => {
  for (const c of candidateContracts) {
    if (bytecode.indexOf(c.binary) === 0) { // Account for constructor values at end of input
      return c
    }
  }

  return null
}

const verifyContractCode = async (address: string, candidateContracts) => {
  const contract = Txid.at(address)

  const txid = await contract.txid.call()
  if (!txid) {
    console.log('no txid')
    return null
  }

  if (contract.address !== (await getReceipt(txid)).contractAddress) {
    console.log('no c ad')
    return null
  }

  const bytecode = (await getTx(txid)).input
  return verifyBytecode(bytecode, candidateContracts)
}

export { verifyContractCode, verifyBytecode }
