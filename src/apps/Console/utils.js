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
