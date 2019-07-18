import large1 from './highlights/large/1.png'
import large2 from './highlights/large/2.png'
import large3 from './highlights/large/3.png'
import large4 from './highlights/large/4.png'
import large5 from './highlights/large/5.png'

import small1 from './highlights/small/1.png'
import small2 from './highlights/small/2.png'
import small3 from './highlights/small/3.png'
import small4 from './highlights/small/4.png'
import small5 from './highlights/small/5.png'

export const banner = {
  text: {
    large: 'Upgrade your organization to the 0.7 Bella release! 🎉',
    small: 'Upgrade to 0.7 Bella! 🎉',
  },
  button: 'More info',
}

export const highlights = [
  {
    title: {
      small: null,
      large: 'Custom labels for apps and addresses',
    },
    description: {
      small: null,
      large: `
        Give addresses and apps their own custom labels so you can easily stay
        organized and navigate your organization.
      `,
    },
    visual: {
      small: small1,
      large: large1,
      color: '#ebf5f4',
    },
  },
  {
    title: {
      small: null,
      large: 'Get activity notifications',
    },
    description: {
      small: null,
      large: `
        The activity panel keeps you informed about the status of
        pending transactions and activity in your organization.
      `,
    },
    visual: {
      small: small2,
      large: large2,
      color: '#d9dfee',
    },
  },
  {
    title: {
      small: null,
      large: 'Export your finances in one click',
    },
    description: {
      small: null,
      large: `
        Export your finances using a standard data format. Just choose the time
        period, and click download.
      `,
    },
    visual: {
      small: small3,
      large: large3,
      color: '#fdefe0',
    },
  },
  {
    title: {
      small: null,
      large: 'Update apps from the App Center',
    },
    description: {
      small: null,
      large: `
        Apply security patches and add new features to the apps in your
        organization by updating to the latest version of apps in the App Center.
      `,
    },
    visual: {
      small: small4,
      large: large4,
      color: '#dff3ec',
    },
  },
  {
    title: {
      small: null,
      large: 'Complete responsive view',
    },
    description: {
      small: null,
      large: `
        Manage your organization on the go from any web3 browser with the
        mobile-friendly Aragon web app.
      `,
    },
    visual: {
      small: small5,
      large: large5,
      color: '#dcddf0',
    },
    upgrade: {
      small: 'Try Bella now',
      large: 'Upgrade your organization',
    },
  },
]
