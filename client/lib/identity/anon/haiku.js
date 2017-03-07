// @flow

import { sha3, bufferToHex } from 'ethereumjs-util'

const adjs = ['autumn', 'hidden', 'bitter', 'misty', 'silent', 'empty', 'dry',
  'dark', 'summer', 'icy', 'delicate', 'quiet', 'white', 'cool', 'spring',
  'winter', 'patient', 'twilight', 'dawn', 'crimson', 'wispy', 'weathered',
  'blue', 'billowing', 'broken', 'cold', 'damp', 'falling', 'frosty', 'green',
  'long', 'late', 'lingering', 'bold', 'little', 'morning', 'muddy', 'old',
  'red', 'rough', 'still', 'small', 'sparkling', 'throbbing', 'shy',
  'wandering', 'withered', 'wild', 'black', 'young', 'holy', 'solitary',
  'fragrant', 'aged', 'snowy', 'proud', 'floral', 'restless', 'divine',
  'polished', 'ancient', 'purple', 'lively', 'nameless']

const nouns = ['waterfall', 'river', 'breeze', 'moon', 'rain', 'wind', 'sea',
  'morning', 'snow', 'lake', 'sunset', 'pine', 'shadow', 'leaf', 'dawn',
  'glitter', 'forest', 'hill', 'cloud', 'meadow', 'sun', 'glade', 'bird',
  'brook', 'butterfly', 'bush', 'dew', 'dust', 'field', 'fire', 'flower',
  'firefly', 'feather', 'grass', 'haze', 'mountain', 'night', 'pond',
  'darkness', 'snowflake', 'silence', 'sound', 'sky', 'shape', 'surf',
  'thunder', 'violet', 'water', 'wildflower', 'wave', 'water', 'resonance',
  'sun', 'wood', 'dream', 'cherry', 'tree', 'fog', 'frost', 'voice', 'paper',
  'frog', 'smoke', 'star']

const upperCase = (str: string): string => str[0].toUpperCase() + str.slice(1)

const haiku = (hex: string): string => {
  const n1 = parseInt(bufferToHex(sha3(hex)).slice(10, 15), 16)
  const n2 = parseInt(bufferToHex(sha3(hex)).slice(20, 25), 16)

  const adj = upperCase(adjs[n1 % (adjs.length-1)])
  const noun = upperCase(nouns[n1 % (adjs.length-1)])

  return `${adj} ${noun}`
}

export default haiku
