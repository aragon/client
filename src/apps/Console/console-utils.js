import { appendTrailingSlash } from '../../util/utils'

const SEPARATOR = '/'

export function buildCommand(command, nextToken) {
  if (typeof command !== 'string' || typeof nextToken !== 'string') {
    throw new Error(
      `Parsing command failed, reason: wrong type passed in. Expected string, got ${typeof method}`
    )
  }

  return appendTrailingSlash(
    command
      .split(SEPARATOR)
      // Remove the last item, which will be an empty string if the command was
      // terminated correctly with a /
      .slice(0, -1)
      .concat(nextToken.toLowerCase())
      .join('/')
  )
}

export function parseCommand(command) {
  if (typeof command !== 'string') {
    throw new Error(
      `Parsing command failed, reason: wrong type passed in. Expected string, got ${typeof method}`
    )
  }

  return command.split(SEPARATOR)
}

export function parseMethodCall(method) {
  if (typeof method !== 'string') {
    throw new Error(
      `Parsing method failed, reason: wrong type passed in. Expected string, got ${typeof method}`
    )
  }
  const trimmedMethod = method.trim()
  const areParenthesisMalformed =
    trimmedMethod.indexOf('(') === 0 ||
    trimmedMethod.indexOf(')') !== trimmedMethod.length - 1
  const [methodName, params] = trimmedMethod.replace(')', '').split('(')

  if (methodName === '' || areParenthesisMalformed) {
    throw new Error(
      'Parsing method failed, reason: malformed method call. Please check if a parenthesis has been misplaced or if you are not passing the method name.'
    )
  }

  if (params === '') {
    return [methodName]
  }

  const splitParams = params.split(',').map(param => param.trim())
  const isCalledWithArguments = splitParams.reduce(
    (haveSeenSeparator, param) => haveSeenSeparator || param.includes(':'),
    false
  )
  if (!isCalledWithArguments) {
    const skippedParams = splitParams.includes('')
    if (skippedParams) {
      throw new Error(
        'Parsing method failed, reason: skipped parameters or dangling commas. Please check if a comma has been misplaced or if you are skipping any parameters.'
      )
    }
    return [methodName, splitParams]
  }
  const allParamsHaveSeparators = splitParams.reduce(
    (previousParams, param) => previousParams && param.includes(':'),
    true
  )

  if (!allParamsHaveSeparators) {
    throw new Error(
      'Parsing method failed, reason: not all parameters have the corresponding arguments. Please check if you have skipped an argument, or misplaced a separator (:).'
    )
  }

  const methodParams = splitParams
    .map(paramAndArgs => paramAndArgs.split(':')[0])
    .map(param => param.trim())
  const methodArgs = splitParams
    .map(paramAndArgs => paramAndArgs.split(':')[1])
    .map(arg => arg.trim())
  const skippedParamsOrArgs =
    methodParams.includes('') ||
    methodArgs.includes('') ||
    methodParams.length !== methodArgs.length
  if (skippedParamsOrArgs) {
    throw new Error(
      'Parsing method failed, reason: not all parameters have the corresponding arguments. Please check if you have skipped an argument, or misplaced a separator (:).'
    )
  }
  return [methodName, methodParams, methodArgs]
}

export function parseInitParams(params) {
  if (typeof params !== 'string') {
    throw new Error(
      `Parsing parameters failed, reason: wrong type passed in. Expected string, got ${typeof method}`
    )
  }

  const areParamsMalformed =
    params.indexOf('(') !== 0 || params.indexOf(')') !== params.length - 1

  if (areParamsMalformed) {
    throw new Error(
      `Parsing parameters failed, reason: malformed init params. Please make sure you're wrapping the parameters between parenthesis correctly`
    )
  }

  const parsedParams = params
    .replace('(', '')
    .replace(')', '')
    .split(',')
    .map(param => param.trim())
  // Passed no params, this is valid
  if (parsedParams.length === 1 && parsedParams[0] === '') {
    return []
  }
  const paramsSkipped = parsedParams.includes('')
  if (paramsSkipped) {
    throw new Error(
      `Parsing parameters failed, reason: skipped params or extra commas. Please make sure you're not skipping any parameters or have dangling commas`
    )
  }
  return parsedParams
}

export function parsePermissions(permissions) {
  if (typeof permissions !== 'string') {
    throw new Error(
      `Parsing permissions failed: wrong type passed in. Expected string, got ${typeof method}`
    )
  }

  const parsedPermissions = permissions
    .split(',')
    .map(permission => permission.trim())
    .map(permission => permission.split(':'))
    .map(permissionArr => permissionArr.map(permArg => permArg.trim()))

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
