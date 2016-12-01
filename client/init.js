import {Module, Core} from './lib/modules'

this.Root = new Core()
this.Root.modules = [
  new Module('main', 'home'),
  new Module('ownership', 'diamond'),
  new Module('voting', 'announcement'),
  new Module('capital', 'money'),
  new Module('rewards', 'users'),
  new Module('accounts', 'university'),
  new Module('settings', 'settings')
]

import Keybase from './lib/keybase'
this.K = Keybase
