import icon from './icon.svg'
import screenshot1 from './screenshot-1.png'
import screenshot2 from './screenshot-2.png'
import screenshot3 from './screenshot-3.png'

export default [
  'token-manager.aragonpm.eth',
  {
    author: 'Aragon Association',
    name: 'Token Manager',
    description:
      'Mint, issue and assign ERC-20 tokens to any Ethereum address.',
    longdesc: 'Mint, issue and assign ERC-20 tokens to any Ethereum address.',
    sourceUrl:
      'https://github.com/aragon/aragon-apps/tree/master/apps/token-manager',
    icons: { large: icon, small: icon },
    screenshots: [screenshot1, screenshot2, screenshot3],
  },
]
