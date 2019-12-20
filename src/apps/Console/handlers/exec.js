import { parseMethodCall } from '../console-utils'

export default async function execHandler(params, { wrapper }) {
  const [proxyAddress, methodWithArgs] = params
  const [methodSignature, args] = parseMethodCall(methodWithArgs)
  const path = await wrapper.getTransactionPath(
    proxyAddress,
    methodSignature,
    args
  )
  return path
}
