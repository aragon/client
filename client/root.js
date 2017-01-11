// @flow
import { Module, Core } from '/client/lib/modules'

const Root = new Core()
Root.modules = [
  new Module('Home', 'home'),
  new Module('Ownership', 'diamond'),
  new Module('Voting', 'announcement'),
  new Module('Fundraising', 'money'),
  new Module('Rewards', 'users'),
  new Module('Accounting', 'browser'),
  new Module('Wallet', 'university'),
  new Module('Settings', 'settings'),

  new Module('Account', 'user', false),
  new Module('Inbox', 'inbox', false),

  new Module('Entity', 'entity', false),
]

export default Root
