import web3 from '/client/lib/ethereum/web3'
import utils from 'ethereumjs-util'

class KeybaseProofs {
  static async createProof(username, address) {
    const proofString = this.getProofString(username, address)
    const signature = web3.eth.sign(address, web3.sha3(proofString))
    const proof = { username, address, proofString, signature }
    return proof
  }

  static verifyProof(proof) {
    const [username, address] = this.parseProofString(proof.proofString)
    if (proof.username !== username) { return null }

    const signatureAddress = this.verifySignature(proof.signature, proof.proofString)
    if (signatureAddress === address) {
      return signatureAddress
    }

    return null
  }

  static verifySignature(signature, message) {
    const r = utils.toBuffer(signature.slice(0, 66))
    const s = utils.toBuffer(`0x${signature.slice(66, 130)}`)
    const v = 27 + parseInt(signature.slice(130, 132), 0)
    const m = utils.toBuffer(web3.sha3(message))
    const pub = utils.ecrecover(m, v, r, s)
    const address = utils.pubToAddress(pub).toString('hex')
    return `0x${address}`
  }

  static getProofString(username, address) {
    return `username:${username},address:${address}`
  }

  static parseProofString(proofString) {
    const keys = ['username:', 'address:']
    return proofString.split(',').map((c, i) => c.replace(keys[i], String()))
  }
}

export default KeybaseProofs
