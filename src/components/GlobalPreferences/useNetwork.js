import { useState } from 'react'
import { defaultEthNode, ipfsDefaultConf, network } from '../../environment'
import { checkValidEthNode } from '../../web3-utils'
import {
  getSelectedCurrency,
  setDefaultEthNode,
  setIpfsGateway,
  setSelectedCurrency,
} from '../../local-settings'

const useNetwork = wrapper => {
  const [networkError, setNetworkError] = useState(null)
  const [ethNode, setEthNodeValue] = useState(defaultEthNode)
  const [ipfsGateway, setIpfsGatewayValue] = useState(ipfsDefaultConf.gateway)

  const handleNetworkChange = async () => {
    try {
      await checkValidEthNode(ethNode, network.type)
    } catch (err) {
      setNetworkError(err)
      return
    }

    setDefaultEthNode(ethNode)
    setIpfsGateway(ipfsGateway)
    // For now, we have to reload the page to propagate the changes
    window.location.reload()
  }
  const handleClearCache = async () => {
    await wrapper.cache.clear()
    window.localStorage.clear()
    window.location.reload()
  }

  return {
    ethNode,
    network,
    ipfsGateway,
    handleNetworkChange,
    handleClearCache,
    networkError,
    setEthNode: ({ currentTarget: { value } }) => setEthNodeValue(value),
    setIpfsGateway: ({ currentTarget: { value } }) =>
      setIpfsGatewayValue(value),
  }
}

export default useNetwork
