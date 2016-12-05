import { Module, Core } from './lib/modules'
import Keybase from './lib/keybase'

this.K = Keybase

this.Root = new Core()
this.Root.modules = [
  new Module('inbox', 'inbox', false),
  new Module('main', 'home'),
  new Module('ownership', 'diamond'),
  new Module('voting', 'announcement'),
  new Module('capital', 'money'),
  new Module('rewards', 'users'),
  new Module('accounts', 'university'),
  new Module('settings', 'settings'),

  new Module('entity', 'entity', false),
]
