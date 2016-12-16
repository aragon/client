import { Module, Core } from './lib/modules'
import { BrowserNotifications } from './lib/notifications'
import Intertron from './lib/intertron'

this.Root = new Core()
this.Root.modules = [
  new Module('Home', 'home'),
  new Module('Ownership', 'diamond'),
  new Module('Voting', 'announcement'),
  new Module('Capital', 'money'),
  new Module('Rewards', 'users'),
  new Module('Accounts', 'university'),
  new Module('Settings', 'settings'),

  new Module('Inbox', 'inbox', false),

  new Module('Entity', 'entity', false),
]

BrowserNotifications.requestPermission()

let start = async () => {
  const intertron = new Intertron()
  const username = await intertron.call('Keybase.getUsername')
  console.log(`Your Keybase username is ${username}`)
}
start()
