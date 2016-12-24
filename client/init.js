import IntertronClient from 'intertron-client'

import Identity from '/client/lib/identity'
import { Module, Core } from './lib/modules'
import { BrowserNotifications } from './lib/notifications'
import KeybaseProofs from './lib/identity/keybase/proofs'

const setIdentity = async (username) => {
  let current = await Identity.current()
  if (!current) {
    current = await Identity.getUsername(username, 'keybase')
    Identity.setCurrent(current)
  }
}

this.Root = new Core()
this.Root.modules = [
  new Module('Home', 'home'),
  new Module('Ownership', 'diamond'),
  new Module('Voting', 'announcement'),
  new Module('Fundraising', 'money'),
  new Module('Rewards', 'users'),
  new Module('Accounting', 'university'),
  new Module('Settings', 'settings'),

  new Module('Account', 'user', false),
  new Module('Inbox', 'inbox', false),

  new Module('Entity', 'entity', false),
]

BrowserNotifications.requestPermission()

const start = async () => {
  const intertron = new IntertronClient()

  const username = await intertron.call('Keybase.getUsername')
  console.log('Your Keybase username is', username)
  setIdentity(username)

  const proof = await KeybaseProofs.createProof(username, EthAccounts.findOne().address)
  const proofPayload = JSON.stringify(proof)
  await intertron.call('Keybase.saveProof', proofPayload)
  console.log('saved proof', proofPayload)
}

setTimeout(start, 500) // web3 <-> node start up time
