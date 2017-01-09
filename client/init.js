// @flow
import { EthAccounts } from 'meteor/ethereum:accounts'

import Root from '/client/root'
import Identity from '/client/lib/identity'
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
    current = await Identity.getRaw(EthAccounts.findOne().address, true)
    Identity.setCurrent(current)
  }
}

setIdentity()

BrowserNotifications.requestPermission()
