// @flow
import { Module, Core } from '/client/lib/modules'

const Root = new Core()
Root.modules = [
  new Module('Home', 'home'),

  new Module('Ownership', 'toll'),
  new Module('Voting', 'thumbs_up_down'),
  new Module('Roles', 'people'),
  new Module('Fundraising', 'payment'),
  // new Module('Rewards', 'users'),
  new Module('Accounting', 'today'),
  new Module('Bylaws', 'account_balance'),

  new Module('Settings', 'settings', true, 'settings', 'Module_Account'),

  new Module('Entity', 'entity', false),
]

export default Root
