import democracy from './templates/democracy'
import multisig from './templates/multisig'

const Multisig = Symbol('Multisig')
const Democracy = Symbol('Democracy')

const Templates = new Map()
Templates.set(Democracy, democracy)
Templates.set(Multisig, multisig)

export default Templates
export { Multisig, Democracy }
