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

export const KNOWN_COMMANDS = ['install', 'exec', 'act']
export const KNOWN_APPS = [
  'voting',
  'finance',
  'vault',
  'agent',
  'tokens',
  'kernel',
  'acl',
]
export const STAGES = {
  INITIAL_STAGE: 'INITIAL_STAGE',
  ACT_SELECT_INSTANCE_STAGE: 'ACT_SELECT_INSTANCE_STAGE',
  EXEC_SELECT_APP_STAGE: 'EXEC_SELECT_APP_STAGE',
  INSTALL_PARAMS_STAGE: 'INSTALL_PARAMS_STAGE',
  INSTALL_SELECT_APP_STAGE: 'INSTALL_SELECT_APP_STAGE',
  EXEC_METHOD_STAGE: 'EXEC_METHOD_STAGE',
}

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
  const methodParams = splitParams.map(param => param.split(':')[0])
  const methodArgs = splitParams.map(param => param.split(':')[1])
  return [methodName, methodParams, methodArgs]
}

export function Parse(input) {
  if (input === '') {
    return {
      stage: STAGES.INITIAL_STAGE,
      input: [''],
      errors: [],
      isDisabled: true,
    }
  }
  // Invalid input for parser
  if (!input || typeof input !== 'string') {
    return {
      errors: ['INVALID_INPUT'],
      isDisabled: true,
    }
  }
  // We start splitting by forward slashes
  const splitInput = input.trim().split('/')
  // user still typing
  if (splitInput.length === 1) {
    return {
      stage: STAGES.INITIAL_STAGE,
      input: splitInput,
      errors: [],
      isDisabled: true,
    }
  }

  const knownCommand = KNOWN_COMMANDS.find(
    knownCommand => knownCommand === splitInput[0].toLowerCase()
  )
  // invalid command
  if (!knownCommand) {
    return {
      errors: ['UNKNOWN_COMMAND'],
      isDisabled: true,
    }
  }

  if (knownCommand.toLowerCase() === 'act') {
    return {
      stage: STAGES.ACT_SELECT_INSTANCE_STAGE,
      input: splitInput,
      errors: [],
      isDisabled: false,
    }
  }
  // At this stage, user is selecting or typing on exec or install
  if (splitInput.length === 2) {
    return {
      stage:
        knownCommand === 'exec'
          ? STAGES.EXEC_SELECT_APP_STAGE
          : STAGES.INSTALL_SELECT_APP_STAGE,
      input: splitInput,
      errors: [],
      isDisabled: true,
    }
  }

  const knownApp = KNOWN_APPS.find(
    knownApp => knownApp === splitInput[1].toLowerCase()
  )

  if (!knownApp) {
    return {
      errors: ['UNKNOWN_APP'],
      isDisabled: true,
    }
  }

  // Here, the user has selected an app to install or execute a command on
  // Specific methods will need to take control as information will be fetched
  // for the intended app to interact with
  return {
    stage:
      knownCommand === 'install'
        ? STAGES.INSTALL_PARAMS_STAGE
        : STAGES.EXEC_METHOD_STAGE,
    input: splitInput,
    errors: [],
    isDisabled: false,
  }
}
