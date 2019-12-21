import { parseMethodCall } from '../console-utils'
import { encodeFunctionCallFromSignature } from '../web3-encoding-utils'

export default async function actHandler(params, { wrapper }) {
  const [selectedAgentInstance, targetAddress, methodWithArgs] = params
  const [methodName, methodParams, methodArgs] = parseMethodCall(methodWithArgs)
  const methodSignature = `${methodName}(${methodParams.join(',')})`

  const encodedFunctionCall = encodeFunctionCallFromSignature(
    methodSignature,
    methodArgs
  )

  const path = await wrapper.getTransactionPath(
    selectedAgentInstance,
    'execute(address,uint256,bytes)',
    [targetAddress, 0, encodedFunctionCall]
  )
  return path
}
