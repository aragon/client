import icon from './icon.svg'
import screenshot1 from './screenshot-1.png'
import screenshot2 from './screenshot-2.png'
import screenshot3 from './screenshot-3.png'

const appName = 'token-manager.aragonpm.eth'
const name = 'Token Manager'
const description =
  'Mint, issue and assign ERC-20 tokens to any Ethereum address.'
const screenshots = [screenshot1, screenshot2, screenshot3]
const sourceUrl =
  'https://github.com/aragon/aragon-apps/tree/master/apps/token-manager'

export default [
  appName,
  { appName, name, icon, description, screenshots, sourceUrl },
]
