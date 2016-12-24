import IntertronClient from 'intertron-client'

import Proofs from './proofs'

const intertron = new IntertronClient()

export default link = async (address: string): string => {
  const username = await intertron.call('Keybase.getUsername')
  console.log('Your Keybase username is', username)

  /* TODO: Make it work
  const proof = await Proofs.createProof(username, address)
  const proofPayload = JSON.stringify(proof)
  await intertron.call('Keybase.saveProof', proofPayload)
  console.log('saved proof', proofPayload) */

  return username
}
