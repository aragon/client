import { Module, Core } from './lib/modules'
import Keybase from './lib/keybase'

this.K = Keybase

this.Root = new Core()
this.Root.modules = [
  new Module('Inbox', 'inbox', false),
  new Module('Main', 'home'),
  new Module('Ownership', 'diamond'),
  new Module('Voting', 'announcement'),
  new Module('Capital', 'money'),
  new Module('Rewards', 'users'),
  new Module('Accounts', 'university'),
  new Module('Settings', 'settings'),

  new Module('Entity', 'entity', false),
]
