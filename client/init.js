import Identity from '/client/lib/identity'
import { Module, Core } from './lib/modules'
import { BrowserNotifications } from './lib/notifications'

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
