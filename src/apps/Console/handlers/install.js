import { hash as namehash } from 'eth-ens-namehash'
import abi from 'web3-eth-abi'
import { parseInitParams, parsePermissions } from '../console-utils'

// Maximum time (in milliseconds) to wait for a response
// from the aragon.js apm repo content fetcher
const REPO_FETCH_TIMEOUT = 3000
const APP_POSTFIX = '.aragonpm.eth'

export default async function installHandler(params, { apps, wrapper }) {
  // Get & properly parse arguments
  const [appName, initArgs, permArgs] = params
  const parsedInitArgs = parseInitParams(initArgs)
  const parsedPermArgs = parsePermissions(permArgs)

  // Resolve namehash and ens domain to fetch the app's repo content
  const fullAppName = (appName.endsWith(APP_POSTFIX)
    ? appName
    : `${appName}${APP_POSTFIX}`
  ).toLowerCase()
  const appId = namehash(fullAppName)
  const ensDomain = await wrapper.ens.resolve(appId)

  const {
    abi: appAbi,
    contractAddress,
    roles,
  } = await wrapper.apm.fetchLatestRepoContent(ensDomain, {
    fetchTimeout: REPO_FETCH_TIMEOUT,
  })

  // Get the initialize function to install and initialize the app
  const initializeAbi = appAbi.find(({ name }) => name === 'initialize')
  const encodedInitializeFunc = abi.encodeFunctionCall(
    initializeAbi,
    parsedInitArgs
  )

  const kernelProxyAddress = apps.find(
    app => app.name.toLowerCase() === 'kernel'
  ).proxyAddress

  const path = await wrapper.getTransactionPath(
    kernelProxyAddress,
    'newAppInstance(bytes32,address,bytes,bool)',
    [appId, contractAddress, encodedInitializeFunc, false]
  )

  // Get the second to last item in the path, as it is the account that will execute kernel.newAppInstance
  const scriptExecutor = path[path.length - 2].to
  const counterfactualAppAddr = await wrapper.kernelProxy.call(
    'newAppInstance',
    appId,
    contractAddress,
    encodedInitializeFunc,
    false,
    { from: scriptExecutor }
  )

  const installAppIntent = [
    [
      kernelProxyAddress,
      'newAppInstance(bytes32,address,bytes,bool)',
      [appId, contractAddress, encodedInitializeFunc, false],
    ],
  ]

  const aclProxyAddress = apps.find(app => app.name.toLowerCase() === 'acl')
    .proxyAddress

  const permissionIntents = parsedPermArgs.map(([role, from, to]) => {
    const roleBytes = roles.find(availableRole => availableRole.id === role)
      .bytes

    return [
      aclProxyAddress,
      'createPermission',
      [to, counterfactualAppAddr, roleBytes, from],
    ]
  })

  const intentBasket = [...installAppIntent, ...permissionIntents]
  const {
    path: pathForBasket,
  } = await wrapper.getTransactionPathForIntentBasket(intentBasket)

  return pathForBasket
}
