import large1 from './highlights/large/1.png'
import large2 from './highlights/large/2.png'
import large3 from './highlights/large/3.png'
import large4 from './highlights/large/4.png'
import large5 from './highlights/large/5.png'
import large6 from './highlights/large/6.png'
import large7 from './highlights/large/7.png'

import small1 from './highlights/small/1.png'
import small2 from './highlights/small/2.png'
import small3 from './highlights/small/3.png'
import small4 from './highlights/small/4.png'
import small5 from './highlights/small/5.png'
import small6 from './highlights/small/6.png'
import small7 from './highlights/small/7.png'

export const banner = {
  text: {
    large: 'Upgrade your organization to the 0.8 Camino release! 🎉',
    small: 'Upgrade to 0.8 Camino! 🎉',
  },
  button: 'More info',
}

const highlights = {}
highlights['latest'] = [
  {
    title: {
      small: null,
      large: 'Streamlined  setup flow',
    },
    description: {
      small: null,
      large: `
        Featuring redesigned organization templates to
        match your needs. Start a company, membership,
        or reputation-based organization in just a few
        clicks.
      `,
    },
    visual: {
      small: small1,
      large: large1,
      color: 'linear-gradient(135.76deg, #65AAFF 8.69%, #5D21D4 103.74%)',
    },
  },
  {
    title: {
      small: null,
      large: 'Enhanced voting transparency',
    },
    description: {
      small: null,
      large: `
        The Voting app has been redesigned to make
        governance more accessible. Easily find and
        understand the details of a vote.
      `,
    },
    visual: {
      small: small2,
      large: large2,
      color: 'linear-gradient(141.36deg, #A8ED2F -9.7%, #68DFB1 93.28%)',
    },
  },
  {
    title: {
      small: null,
      large: 'Stay up to date with email notifications',
    },
    description: {
      small: null,
      large: `
        Whether it's a new vote, financial transfer,
        or permissions change, subscribe to the events
        that matter to you.
      `,
    },
    visual: {
      small: small3,
      large: large3,
      color: 'linear-gradient(324.69deg, #FFF886 -112.1%, #FF4E78 91.91%)',
    },
  },
  {
    title: {
      small: null,
      large: 'Better financial visibility',
    },
    description: {
      small: null,
      large: `
        View and sort your organization’s finances for
        greater clarity and insight. Now with more
        powerful filters.
      `,
    },
    visual: {
      small: small4,
      large: large4,
      color: 'linear-gradient(135.76deg, #65AAFF 8.69%, #5D21D4 103.74%)',
    },
  },
  {
    title: {
      small: null,
      large: 'Modern governance',
    },
    description: {
      small: null,
      large: `
        Simplified permissions management that
        makes it easier to understand who
        has authority in your organization.
      `,
    },
    visual: {
      small: small5,
      large: large5,
      color: 'linear-gradient(131.84deg, #FF9372 -58.49%, #FFD770 100%)',
    },
  },
  {
    title: {
      small: null,
      large: 'One app, endless possibilities',
    },
    description: {
      small: null,
      large: `
        Aragon Agent enables organizations to interact
        directly with any Ethereum application. Access
        Web3 like never before.
      `,
    },
    visual: {
      small: small6,
      large: large6,
      color: 'linear-gradient(126.55deg, #C4E5DF 6.11%, #D4EFE6 96.84%);',
    },
  },
  {
    title: {
      small: null,
      large: 'Organizations reimagined',
    },
    description: {
      small: null,
      large: `
        A glimpse into the future of organizations that
        you can use today.
      `,
    },
    visual: {
      small: small7,
      large: large7,
      color:
        'linear-gradient(296.62deg, #95BBCE -14.74%, #C5D0E6 38.16%, #E7E4F6 99.41%)',
    },
    upgrade: {
      small: 'Discover 0.8 Camino',
      large: 'Discover 0.8 Camino',
    },
  },
]

highlights['0.6'] = [...highlights['latest']]
highlights['0.6'][6] = {
  title: {
    small: null,
    large: 'What else is new?',
  },
  description: {
    small: null,
    large: `
      A mobile-friendly UI, custom labels for apps
      and addresses, an activity panel that keeps you
      informed about the status of pending
      transactions, and much more!
    `,
  },
  visual: {
    small: small7,
    large: large7,
    color:
      'linear-gradient(296.62deg, #95BBCE -14.74%, #C5D0E6 38.16%, #E7E4F6 99.41%)',
  },
  upgrade: {
    small: 'Upgrade to 0.8 Camino',
    large: 'Upgrade to 0.8 Camino',
  },
}

export { highlights }
