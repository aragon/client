// @flow
import utils from 'ethereumjs-util'
import { personalSign, personalECRecover, toHex } from '/client/lib/ethereum/sign'

class KeybaseProofs {
  static async createProof(username, address) {
    const proofString = this.getProofString(username, address)
    const signature = await personalSign(address, toHex(proofString))
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
    return personalECRecover(toHex(message), signature)
  }

  static getProofString(username, address) {
    return `I am ${username} on Keybase verifying my Ethereum address ${address.toLowerCase()} by signing this proof with its private key`
  }
}

export default KeybaseProofs
