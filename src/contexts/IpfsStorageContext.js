import React, {
  useReducer,
  createContext,
  useEffect,
  useCallback,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import {
  createIpfsProvider,
  ensureServerIsListeningToStorageContract,
  instantiateStorageContract,
  getIPFSProvider,
  optmisticallyPinDag,
} from '../storage'
import { AppType, AragonType } from '../prop-types'

export const IPFSStorageContext = createContext({})

const NO_STORAGE_APP_INSTALLED = 'noStorageAppInstalled'
const IPFS_PROVIDER_CONNECTION_SUCCESS = 'ipfsProviderConnectionSuccess'
const IPFS_PROVIDER_CONNECTION_FAILURE = 'ipfsProviderConnectionFailure'
const IPFS_PROVIDER_CONNECTING = 'ipfsProviderConnecting'

const initialStorageContextValue = {
  isStorageAppInstalled: null,
  ipfsEndpoints: null,
  [IPFS_PROVIDER_CONNECTING]: false,
  [IPFS_PROVIDER_CONNECTION_SUCCESS]: false,
  [IPFS_PROVIDER_CONNECTION_FAILURE]: false,
  error: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case NO_STORAGE_APP_INSTALLED:
      return {
        ...initialStorageContextValue,
        isStorageAppInstalled: false,
      }
    case IPFS_PROVIDER_CONNECTION_SUCCESS:
      return {
        ...state,
        ipfsEndpoints: action.payload.ipfsEndpoints,
        [IPFS_PROVIDER_CONNECTING]: false,
        [IPFS_PROVIDER_CONNECTION_SUCCESS]: true,
        [IPFS_PROVIDER_CONNECTION_FAILURE]: false,
        isStorageAppInstalled: true,
      }
    case IPFS_PROVIDER_CONNECTION_FAILURE:
      return {
        ...state,
        ipfsEndpoints: null,
        [IPFS_PROVIDER_CONNECTING]: false,
        [IPFS_PROVIDER_CONNECTION_SUCCESS]: false,
        [IPFS_PROVIDER_CONNECTION_FAILURE]: true,
        error: action.error,
        isStorageAppInstalled: true,
      }
    case IPFS_PROVIDER_CONNECTING:
      return {
        ...state,
        ipfsEndpoints: null,
        [IPFS_PROVIDER_CONNECTING]: true,
        [IPFS_PROVIDER_CONNECTION_SUCCESS]: false,
        [IPFS_PROVIDER_CONNECTION_FAILURE]: false,
      }
    default:
      return state
  }
}

export const connectionSuccess = ipfsEndpoints => ({
  type: IPFS_PROVIDER_CONNECTION_SUCCESS,
  payload: {
    ipfsEndpoints,
  },
})

export const connectionFailure = error => ({
  type: IPFS_PROVIDER_CONNECTION_FAILURE,
  error,
})

export const connecting = () => ({
  type: IPFS_PROVIDER_CONNECTING,
})

const noStorageApp = () => ({
  type: NO_STORAGE_APP_INSTALLED,
})

export const IPFSStorageProvider = ({ children, apps, wrapper }) => {
  const [ipfsStore, dispatchToIpfsStore] = useReducer(
    reducer,
    initialStorageContextValue
  )
  const [storageContract, setStorageContract] = useState({})
  const setData = useCallback(
    (key, dag) => {
      if (typeof dag !== 'object') {
        throw new Error('type of value param must be object')
      }
      const set = async () => {
        const cid = await optmisticallyPinDag(dag)
        await storageContract.registerData(
          wrapper.web3.utils.fromAscii(key),
          cid
        )
      }
      if (!ipfsStore.isStorageAppInstalled) {
        throw new Error('No storage app installed')
      }
      return set()
    },
    [ipfsStore.isStorageAppInstalled, storageContract, wrapper]
  )

  const getData = useCallback(
    key => {
      const get = async () => {
        const cid = await storageContract.getRegisteredData(
          wrapper.web3.utils.fromAscii(key)
        )
        return ipfsStore.ipfsEndpoints.dag.get(cid)
      }

      if (!ipfsStore.isStorageAppInstalled) {
        throw new Error('No storage app installed')
      }
      return get()
    },
    [ipfsStore, storageContract, wrapper]
  )

  useEffect(() => {
    const getStorageProvider = async () => {
      let storageApp
      try {
        const appAddressNameSpace = await wrapper.kernelProxy.call(
          'APP_ADDR_NAMESPACE'
        )
        const defaultStorageAppProxyAddress = await wrapper.kernelProxy.call(
          'getApp',
          appAddressNameSpace,
          '0xa53eae0295e6028e828951e8a5a05c14acb4d7bc636d130658894dd48b93ec9a'
        )
        storageApp = apps.find(
          ({ proxyAddress }) =>
            proxyAddress.toLowerCase() ===
            defaultStorageAppProxyAddress.toLowerCase()
        )
        if (!storageApp) {
          dispatchToIpfsStore(noStorageApp())
        }
      } catch (error) {
        dispatchToIpfsStore(connectionFailure(error))
      }

      try {
        const storageContract = instantiateStorageContract(
          storageApp.proxyAddress,
          storageApp.abi,
          wrapper
        )
        await ensureServerIsListeningToStorageContract(storageApp.proxyAddress)
        setStorageContract(storageContract)
        const { alias } = await getIPFSProvider()
        const ipfsEndpoints = await createIpfsProvider(alias)
        dispatchToIpfsStore(connectionSuccess(ipfsEndpoints))
      } catch (error) {
        dispatchToIpfsStore(connectionFailure(error))
      }
    }
    getStorageProvider()
  }, [wrapper, apps])

  return (
    <IPFSStorageContext.Provider value={{ ...ipfsStore, setData, getData }}>
      {children}
    </IPFSStorageContext.Provider>
  )
}

IPFSStorageProvider.propTypes = {
  apps: PropTypes.arrayOf(AppType),
  children: PropTypes.node.isRequired,
  wrapper: AragonType,
}
