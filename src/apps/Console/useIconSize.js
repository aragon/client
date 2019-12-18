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
