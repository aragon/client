import Aragon from '@aragon/wrapper'

const IPFS_CONF_DEFAULT = {
  rpc: { host: 'ipfs.infura.io', port: '5001', protocol: 'https' },
}

const initWrapper = (
  daoAddress,
  ensRegistryAddress,
  { ipfsConf = IPFS_CONF_DEFAULT, provider } = {}
) => {
  const wrapper = new Aragon(daoAddress, {
    ensRegistryAddress,
    provider,
    apm: { ipfs: ipfsConf },
  })

  return wrapper.init().then(() => {
    return wrapper
  })
}

export default initWrapper
