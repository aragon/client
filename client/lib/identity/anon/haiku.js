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

const upperCase = (str) => str[0].toUpperCase() + str.slice(1)

export default haiku = (hex: string): string => {
  const n = Math.abs(Math.cos(parseInt(hex, 16)))

  const adj = upperCase(adjs[Math.floor(n*(adjs.length-1))])
  const noun = upperCase(nouns[Math.floor(n*(nouns.length-1))])

  return `${adj} ${noun}`
}
