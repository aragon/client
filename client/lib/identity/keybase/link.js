// @flow

import IntertronClient from 'intertron-client'

import Proofs from './proofs'

const intertron = new IntertronClient()

const link = async (address: string, proofFilename: string): Promise<string> => {
  console.log('linking', address)

  const username = await intertron.call('Keybase.getUsername')
  console.log('Your Keybase username is', username, address)

  const proof = await Proofs.createProof(username, address)
  const proofPayload = JSON.stringify(proof)
  await intertron.call('Keybase.saveProof', proofPayload, proofFilename)

  console.log('saved proof', proofPayload)

  return username
}

export default link
