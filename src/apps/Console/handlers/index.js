import actHandler from './act'
import execHandler from './exec'
import installHandler from './install'

const handlers = new Map([
  ['act', actHandler],
  ['exec', execHandler],
  ['install', installHandler],
])

export default handlers
