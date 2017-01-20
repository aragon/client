// @flow

import web3 from '/client/lib/ethereum/web3'
import utils from 'ethereumjs-util'

class KeybaseProofs {
  static signWrapper(address: string, payload: string): Promise<string> {
    return new Promise((resolve, reject) => {
      web3.eth.sign(address, utils.bufferToHex(utils.sha3(payload)), (e, j) => {
        if (e) reject(e)
        resolve(j)
      })
    })
  }

  static async createProof(username, address) {
    const proofString = this.getProofString(username, address)
    const signature = await this.signWrapper(address, proofString)
    const proof = { username, address, proofString, signature }
    return proof
  }

  static verifyProof(proof) {
    const proofString = this.getProofString(proof.username, proof.address)
    if (proof.proofString !== proofString) { return null }

    const signatureAddress = this.verifySignature(proof.signature, proof.proofString)

    if (signatureAddress === proof.address) {
      return signatureAddress
    }

    return null
  }

  static verifySignature(signature, message) {
    const r = utils.toBuffer(signature.slice(0, 66))
    const s = utils.toBuffer(`0x${signature.slice(66, 130)}`)
    const v = 27 + utils.toBuffer(`0x${signature.slice(130, 132)}`)[0]
    const m = utils.toBuffer(utils.sha3(message))
    const pub = utils.ecrecover(m, v, r, s)
    const address = utils.pubToAddress(pub).toString('hex')
    return `0x${address}`
  }

  static getProofString(username, address) {
    return `I am ${username} on Keybase verifying my Ethereum address ${address.toLowerCase()} by signing this proof with its private key`
  }
}

export default KeybaseProofs
