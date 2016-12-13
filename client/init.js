import { Module, Core } from './lib/modules'
import { NotificationsListener, BrowserNotifications, NotificationsManager } from './lib/notifications'
import Company from '/client/lib/ethereum/deployed'

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

setTimeout(() => {
  const testListener = new NotificationsListener(Company.TestNotification, 'Test', args => `hello ${args.test}`, () => '/inbox')
  NotificationsManager.listen([testListener])
}, 3500)

// BrowserNotifications.showNotification("hola", "test notis", () => console.log('clicked'), () => console.log('closed :O'))
