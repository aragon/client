import { addMinutes, addHours, addDays } from 'date-fns'

export const notifications = [
  {
    app: '0xAppAddress',
    title: 'Voting (XVT)',
    body: 'New voting was created. You can now vote.',
    date: addMinutes(new Date(), -10),
  },
  {
    app: '0xAppAddress',
    title: 'Tokens (XVT)',
    body: 'You have received 100 XVT.',
    date: addMinutes(new Date(), -25),
  },
  {
    app: '0xAppAddress',
    title: 'Fundraising (ANT)',
    body: 'New public fundraising started, cap is 192.5 ETH.',
    date: addHours(new Date(), -1),
  },
  {
    app: '0xAppAddress',
    title: 'Tokens (XVT)',
    body: 'You have received 100 XVT.',
    date: addHours(new Date(), -3),
  },
  {
    app: '0xAppAddress',
    title: 'Tokens (XVT)',
    body: 'You have received 100 XVT.',
    date: addDays(new Date(), -1),
  },
  {
    app: '0xAppAddress',
    title: 'Fundraising (ANT)',
    body: 'New public fundraising started, cap is 192.5 ETH.',
    date: addDays(new Date(), -2),
  },
  {
    app: '0xAppAddress',
    title: 'Tokens (XVT)',
    body: 'You have received 100 XVT.',
    date: addDays(new Date(), -3),
  },
  {
    app: '0xAppAddress',
    title: 'Tokens (XVT)',
    body: 'You have received 100 XVT.',
    date: addDays(new Date(), -3),
  },
]

const appSrc = id => {
  const port = {
    voting: 3001,
    finance: 3002,
  }[id]
  if (!port) return 'apps/demo'
  return `${document.location.protocol}//${document.location.hostname}:${port}/`
}

export const groups = [
  { id: 'core', name: 'Core Devs' },
  { id: 'community', name: 'Community Devs' },
]

export const apps = [
  {
    id: 'tokens',
    name: 'Tokens',
    instances: [{ id: 'ant', name: 'ANT' }, { id: 'token', name: 'TOKEN' }],
    alwaysDisplayInstances: true,
  },
  {
    id: 'voting',
    name: 'Voting',
    instances: [{ id: 'ant', name: 'ANT' }],
    alwaysDisplayInstances: true,
  },
  {
    id: 'finance',
    name: 'Finance',
    instances: [{ id: 'finance', name: 'Finance' }],
    alwaysDisplayInstances: false,
  },
  {
    id: 'fundraising',
    name: 'Fundraising',
    instances: [{ id: 'fundraising', name: 'Fundraising' }],
    alwaysDisplayInstances: false,
  },
  {
    id: 'identity',
    name: 'Identity',
    instances: [{ id: 'identity', name: 'Identity' }],
    alwaysDisplayInstances: false,
  },
].map(app => ({ ...app, src: appSrc(app.id) }))

export const tokens = [
  { symbol: 'XVT', name: 'Voting Token', amount: '100097995', value: 70 },
  { symbol: 'LIS', name: 'Voting Token', amount: '10002', value: 30 },
]

export const prices = [
  { symbol: 'ETH', value: '$302,91', status: 'up' },
  { symbol: 'ANT', value: '$2.39', status: 'down' },
  { symbol: 'DNT', value: '$0.35', status: 'down' },
]

export const permissions = {
  byEntity: [
    {
      entity: '0x2e05a304d3040f9c8c21380d4a9f659ae752105a',
      type: 'User',
      permissions: 'Assign tokens, Create groups, Create vote',
    },
    {
      entity: '0x9f62e05a304d3040f1389c8c20d4a59ae752105a',
      type: 'User',
      permissions: 'Mint tokens',
    },
    {
      entity: '0x5a32e004d3040f1389c8c20d4a9f659ae752105a',
      type: 'Group',
      permissions: 'Assign tokens, Create groups',
    },
    {
      entity: '0x9c82e05a304d3040f138c20d4a9f659ae752105a',
      type: 'App',
      permissions:
        'Assign tokens, Mint new tokens, Revoke vesting, Create vote…',
    },
    {
      entity: '0xa9f2e05a304d3040f1389c8c20d4659ae752105a',
      type: 'User',
      permissions: 'Assign tokens, Create groups, Create vote',
    },
    {
      entity: '0x40f2e05a304d301389c8c20d4a9f659ae752105a',
      type: 'User',
      permissions: 'Assign tokens, Create groups, Create vote',
    },
  ],
  appPermissions: [
    {
      permissionId: 'abc',
      actionId: 'ASSIGN_TOKENS',
      actionName: 'Assign tokens',
      allowedFor: 'Voting',
      editableBy: 'Voting',
      parameters: 'Receiver, Amount',
      constraints: null,
      pending: false,
    },
    {
      permissionId: 'def',
      actionId: 'REVOKE_TOKENS',
      actionName: 'Revoke tokens',
      allowedFor: 'Voting',
      editableBy: 'Voting',
      parameters: 'Holder of vesting',
      constraints: null,
      pending: false,
    },
    {
      permissionId: 'ghi',
      actionId: 'MINT_NEW_TOKENS',
      actionName: 'Mint new tokens',
      allowedFor: 'Voting',
      editableBy: 'Voting',
      parameters: 'Amount',
      constraints: [],
      pending: false,
    },
    {
      permissionId: 'jkl',
      actionId: 'MINT_NEW_TOKENS',
      actionName: 'Mint new tokens',
      allowedFor: 'DAO Factory',
      editableBy: 'DAO Factory',
      parameters: 'Amount',
      constraints: [],
      pending: false,
    },
    {
      permissionId: 'mno',
      actionId: 'ASSIGN_TOKENS',
      actionName: 'Assign tokens',
      allowedFor: 'SuperUsers',
      editableBy: 'Voting',
      parameters: 'Amount',
      constraints: [],
      pending: false,
    },
    {
      permissionId: 'pqr',
      actionId: 'ASSIGN_TOKENS',
      actionName: 'Assign tokens',
      allowedFor: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
      editableBy: 'Voting',
      parameters: 'Receiver, Amount',
      constraints: null,
      pending: true,
    },
  ],
}

export const actionIntent = {
  description: 'perform a payment to',
  to: '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
}
export const actionPaths = [
  {
    appName: 'Voting (ANT)',
    description:
      'The Voting (ANT) app will create a new voting for ANT holders to decide whether to perform this action or not.',
    tx: { from: null, to: null, data: null },
  },
  {
    appName: 'Tokens (XVT) -> Voting (ANT)',
    description:
      '1. The Tokens (XVT) app will forward actions requested by XVT holders.\n2. The Voting (ANT) app will create a new voting for ANT holders to decide whether to perform this action or not.',
    tx: { from: null, to: null, data: null },
  },
]
