import { addMinutes, addHours, addDays } from 'date-fns'

export const notifications = [
  {
    title: 'Voting (XVT)',
    description: 'New voting was created. You can now vote.',
    date: addMinutes(new Date(), -10),
    unread: true,
  },
  {
    title: 'Tokens (XVT)',
    description: 'You have received 100 XVT.',
    date: addMinutes(new Date(), -25),
    unread: true,
  },
  {
    title: 'Fundraising (ANT)',
    description: 'New public fundraising started, cap is 192.5 ETH.',
    date: addHours(new Date(), -1),
    unread: false,
  },
  {
    title: 'Tokens (XVT)',
    description: 'You have received 100 XVT.',
    date: addHours(new Date(), -3),
    unread: false,
  },
  {
    title: 'Tokens (XVT)',
    description: 'You have received 100 XVT.',
    date: addDays(new Date(), -1),
    unread: false,
  },
  {
    title: 'Fundraising (ANT)',
    description: 'New public fundraising started, cap is 192.5 ETH.',
    date: addDays(new Date(), -2),
    unread: false,
  },
  {
    title: 'Tokens (XVT)',
    description: 'You have received 100 XVT.',
    date: addDays(new Date(), -3),
    unread: false,
  },
  {
    title: 'Tokens (XVT)',
    description: 'You have received 100 XVT.',
    date: addDays(new Date(), -3),
    unread: false,
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
    script: 'apps/demo/worker.js',
    alwaysDisplayInstances: true,
  },
  {
    id: 'voting',
    name: 'Voting',
    instances: [{ id: 'ant', name: 'ANT' }],
    script: 'apps/demo/worker.js',
    alwaysDisplayInstances: true,
  },
  {
    id: 'finance',
    name: 'Finance',
    instances: [{ id: 'finance', name: 'Finance' }],
    script: 'apps/demo/worker.js',
    alwaysDisplayInstances: false,
  },
  {
    id: 'fundraising',
    name: 'Fundraising',
    instances: [{ id: 'fundraising', name: 'Fundraising' }],
    script: 'apps/demo/worker.js',
    alwaysDisplayInstances: false,
  },
  {
    id: 'identity',
    name: 'Identity',
    instances: [{ id: 'identity', name: 'Identity' }],
    script: 'apps/demo/worker.js',
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

export const homeActions = [
  { id: 'transfer-tokens', label: 'Transfer Tokens', app: 'tokens' },
  { id: 'assign-tokens', label: 'Assign Tokens', app: 'tokens' },
  { id: 'vote', label: 'Vote', app: 'voting' },
  { id: 'view-identity', label: 'Identity', app: 'identity' },
  { id: 'check-finance', label: 'Check Finance', app: 'finance' },
  { id: 'new-payment', label: 'New Payment', app: 'tokens' },
]

export const permissions = {
  entities: [
    { id: 1, label: 'Wandering Thunder', badge: { label: 'You' } },
    { id: 2, label: 'Black Wildflower' },
    { id: 3, label: 'Black Wildflower' },
    { id: 4, label: 'Black Wildflower' },
    { id: 5, label: 'Black Wildflower' },
    { id: 6, label: 'Black Wildflower' },
  ],
  actions: [
    {
      title: 'Open a new voting',
      summary: `
        Approved votings will perform the given action as if they were executed
        by this app
      `,
      canPerform: [['Tokens', 'ANT'], ['Multisig'], ['Groups', 'Core Devs']],
      canRevoke: [['Multisig']],
    },
    {
      title: 'Stop an open voting',
      summary: `
        Will stop an open voting and won’t perform the voting’s action
      `,
      canPerform: [['Tokens', 'ANT'], ['Multisig'], ['Groups', 'Core Devs']],
      canRevoke: [['Multisig']],
    },
  ],
  assigned: [
    {
      title: 'Issue new tokens on Tokens (ANT)',
      summary: `
        Will mint new ANT tokens
      `,
      canRevoke: 'Multisig',
    },
    {
      title: 'Create new permissions on Kernel',
      summary: `
        Will create new permissions if the receiving actions and entities…
      `,
      canRevoke: 'Multisig',
    },
    {
      title: 'Create a new public token sale on Fundraising (ANT)',
      summary: `
        Will create a new public token sale and will be able to receive funds…
      `,
      canRevoke: 'Multisig',
    },
  ],
}
