import { shape, array, string, bool } from 'prop-types'

const App = shape({
  abi: array.isRequired,
  appId: string.isRequired,
  baseUrl: string.isRequired,
  codeAddress: string.isRequired,
  functions: array.isRequired,
  hasWebApp: bool.isRequired,
  isAragonOsInternalApp: bool,
  isForwarder: bool,
  kernelAddress: string,
  name: string.isRequired,
  proxyAddress: string.isRequired,
  roles: array.isRequired,
  src: string.isRequired,
  status: string,
})

export default App
