import { useInside, GU } from '@aragon/ui'
const ICON_SIZES = new Map([
  ['large', 6 * GU],
  ['medium', 3 * GU],
  ['small', 2 * GU],
  ['tiny', 1.75 * GU],
])

// Mapping of button size => icon size
const BUTTON_ICON_SIZES = new Map([
  ['medium', 'medium'],
  ['small', 'medium'],
  ['mini', 'small'],
])

// Known commands to be displayed on the console
export const KNOWN_COMMANDS = ['install', 'exec', 'act']

export function useIconSize(size) {
  const [insideButtonIcon, buttonData] = useInside('Button:icon')

  // If no size is set on the icon, and it is inside
  // a Button icon slot, adapt it to the size of the button.
  const sizeName =
    !size && insideButtonIcon ? BUTTON_ICON_SIZES.get(buttonData.size) : size

  return ICON_SIZES.get(sizeName || 'medium')
}

export function encodeFunctionCall(signature, params = [], web3) {
  const sigBytes = web3.eth.abi.encodeFunctionSignature(signature)

  const types = signature.replace(')', '').split('(')[1]

  // No params, return signature directly
  if (types === '') {
    return sigBytes
  }

  const paramBytes = web3.eth.abi.encodeParameters(types.split(','), params)

  return `${sigBytes}${paramBytes.slice(2)}`
}

export function parseCommand(command) {
  if (typeof command !== 'string') {
    throw new Error(`Wrong type passed in. Needs string, got ${typeof method}`)
  }

  return command.split('/')
}

export function parseMethodCall(method) {
  if (typeof method !== 'string') {
    throw new Error(`Wrong type passed in. Needs string, got ${typeof method}`)
  }
  const trimmedMethod = method.trim(' ')
  const areParenthesisMalformed =
    trimmedMethod.indexOf('(') === 0 ||
    trimmedMethod.indexOf(')') !== trimmedMethod.length - 1
  const [methodName, params] = trimmedMethod.replace(')', '').split('(')

  if (methodName === '' || areParenthesisMalformed) {
    throw new Error('Malformed method call.')
  }

  if (params === '') {
    return [methodName]
  }

  const splitParams = params.split(',').map(param => param.trim(' '))
  const isCalledWithArguments = splitParams.reduce(
    (hasArgs, currentParam) => hasArgs && currentParam.indexOf(':') !== -1,
    true
  )

  if (!isCalledWithArguments) {
    return [methodName, splitParams]
  }

  const methodParams = splitParams.map(
    paramAndArgs => paramAndArgs.split(':')[0]
  )
  const methodArgs = splitParams
    .map(paramAndArgs => paramAndArgs.split(':')[1])
    .map(arg => arg.trim(' '))
  return [methodName, methodParams, methodArgs]
}

export function parseInitParams(params) {
  if (typeof params !== 'string') {
    throw new Error(`Wrong type passed in. Needs string, got ${typeof method}`)
  }

  const areParamsMalformed =
    params.indexOf('(') !== 0 || params.indexOf(')') !== params.length - 1

  if (areParamsMalformed) {
    throw new Error('Malformed init params.')
  }

  return params
    .replace('(', '')
    .replace(')', '')
    .split(',')
    .map(param => param.trim(' '))
    .filter(param => param !== '')
}

export function parsePermissions(permissions) {
  if (typeof permissions !== 'string') {
    throw new Error(`Wrong type passed in. Needs string, got ${typeof method}`)
  }

  const parsedPermissions = permissions
    .split(',')
    .map(permission => permission.trim(' '))
    .map(permission => permission.split(':'))
    .map(permissionArr => permissionArr.map(permArg => permArg.trim(' ')))

  const arePermissionsFormattedCorrectly = parsedPermissions.reduce(
    (arePastPermissionsValid, currentPermissionParams) =>
      arePastPermissionsValid && currentPermissionParams.length === 3,
    true
  )

  if (!arePermissionsFormattedCorrectly) {
    throw new Error('Permissions malformed.')
  }

  return parsedPermissions
}
