import Identity from '/client/lib/identity'
import { Module, Core } from '/client/lib/modules'
import { BrowserNotifications } from '/client/lib/notifications'

import Shake from '/client/lib/shake'

Shake.createUser({
  user: {
    firstName: 'Shakey',
    lastName: 'McShakester',
    dateOfBirth: '1988-07-22',
    phoneNumber: '15145551234',
    email: 'shakey@shakepay.co',
  },
  address: {
    address1: '123 Awesome Drive',
    address2: 'Apt 1223',
    city: 'Montreal',
    zipCode: 'H2X2E3',
    fedDistrict: 'Quebec',
    country: 'CA',
  },
  card: {
    currency: 'USD',
    type: 'physical',
  },
})

const setIdentity = async () => {
  let current = Identity.current(true)
  if (!current) {
    current = await Identity.get(EthAccounts.findOne().address, true)
    Identity.setCurrent(current)
  }
}

setIdentity()

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
