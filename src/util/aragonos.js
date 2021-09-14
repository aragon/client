import { soliditySha3 } from './web3'

// See https://github.com/aragon/aragonOS/blob/v4.2.0/contracts/kernel/KernelConstants.sol#L26
export const KERNEL_CORE_NAMESPACE = soliditySha3('core')
export const KERNEL_APP_BASE_NAMESPACE = soliditySha3('base')
export const KERNEL_APP_ADDR_NAMESPACE = soliditySha3('app')
