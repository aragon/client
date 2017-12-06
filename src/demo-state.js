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

export const apps = [
  {
    id: 'tokens',
    name: 'Tokens',
    instances: [{ id: 'ant', name: 'ANT' }, { id: 'token', name: 'TOKEN' }],
  },
  { id: 'voting', name: 'Voting', instances: [{ id: 'ant', name: 'ANT' }] },
  {
    id: 'groups',
    name: 'Groups',
    instances: [
      { id: 'core', name: 'Core Devs' },
      { id: 'community', name: 'Community Devs' },
    ],
  },
  { id: 'finance', name: 'Finance' },
  {
    id: 'fundraising',
    name: 'Fundraising',
    instances: [{ id: 'ant', name: 'ANT' }],
  },
  { id: 'permissions', name: 'Permissions' },
  { id: 'identity', name: 'Identity' },
]
