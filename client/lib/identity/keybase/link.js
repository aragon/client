// @flow

import IntertronClient from 'intertron-client'

import { KeybaseRegistry } from '/client/lib/ethereum/contracts'
import { dispatcher } from '/client/lib/action-dispatcher'

import Proofs from './proofs'

const intertron = new IntertronClient()

const link = async (address: string, proofFilename: string): Promise<string> => {
  const username = await intertron.call('Keybase.getUsername')
  console.log('Your Keybase username is', username, address)

  const proof = await Proofs.createProof(username, address)
  const proofPayload = JSON.stringify(proof)

  const chainRegistry = await KeybaseRegistry.deployed()
  dispatcher.performTransaction(chainRegistry.register, username, address)

  await intertron.call('Keybase.saveProof', proofPayload, proofFilename)

  return username
}

export default link
