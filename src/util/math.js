export function formatNumber(num, decimals = 2) {
  const multiplicator = Math.pow(10, decimals)
  const roundedNum = Math.round(num * multiplicator) / multiplicator
  const numString = String(roundedNum)

  if (!decimals) {
    return numString
  }

  const [whole, decimal = ''] = numString.split('.')
  return `${whole}.${
    decimal.length > decimal
      ? decimal.slice(0, decimals)
      : decimal.padEnd(decimals, '0')
  }`
}

/**
 * Re-maps a number from one range to another.
 *
 * In the example above, the number '25' is converted from a value in the range
 * 0..100 into a value that ranges from the left edge (0) to the right edge
 * (width) of the screen. Numbers outside the range are not clamped to 0 and 1,
 * because out-of-range values are often intentional and useful.
 *
 * From Processing.js
 *
 * @param {Number} value The incoming value to be converted
 * @param {Number} istart Lower bound of the value's current range
 * @param {Number} istop Upper bound of the value's current range
 * @param {Number} ostart Lower bound of the value's target range
 * @param {Number} ostop Upper bound of the value's target range
 * @returns {Number} Mapped value
 */
export function map(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * ((value - istart) / (istop - istart))
}

/**
 * Normalizes a number from another range into a value between 0 and 1.
 *
 * Identical to map(value, low, high, 0, 1)
 * Numbers outside the range are not clamped to 0 and 1, because out-of-range
 * values are often intentional and useful.
 *
 * From Processing.js
 *
 * @param {Number} aNumber The incoming value to be converted
 * @param {Number} low Lower bound of the value's current range
 * @param {Number} high Upper bound of the value's current range
 * @returns {Number} Normalized number
 */
export function norm(aNumber, low, high) {
  return (aNumber - low) / (high - low)
}

/**
 * Calculates a number between two numbers at a specific increment. The
 * progress parameter is the amount to interpolate between the two values where
 * 0.0 equal to the first point, 0.1 is very near the first point, 0.5 is
 * half-way in between, etc. The lerp function is convenient for creating
 * motion along a straight path and for drawing dotted lines.
 *
 * From Processing.js
 *
 * @param {Number} progress Between 0.0 and 1.0
 * @param {Number} value1 First value
 * @param {Number} value2 Second value
 * @returns {Number} Increment value
 */
export function lerp(progress, value1, value2) {
  return (value2 - value1) * progress + value1
}

/**
 * Constrains a value to not exceed a maximum and minimum value.
 *
 * From Processing.js
 *
 * @param {Number} aNumber The value to constrain
 * @param {Number} aMin Minimum limit
 * @param {Number} aMax Maximum limit
 * @returns {Number} Contrained value
 */
export function clamp(aNumber, aMin, aMax) {
  return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber
}

/**
 * Returns a random integer between min (included) and max (excluded)
 * Note: Using Math.round() would give a non-uniform distribution
 *
 * From Mozilla MDN
 *
 * @param {Number} min The minimum number (included)
 * @param {Number} max The maximum number (excluded)
 * @returns {Number} Random integer
 */
export function randomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * Random number between two values.
 *
 * From Mozilla MDN
 *
 * @param {Number} min The minimum number (included)
 * @param {Number} max The maximum number (excluded)
 * @returns {Number} Random number
 */
export function random(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min)) + min
}
