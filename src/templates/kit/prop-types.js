import PropTypes from 'prop-types'

export const ScreenPropsType = PropTypes.shape({
  back: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  next: PropTypes.func.isRequired,
  screenIndex: PropTypes.number.isRequired,

  /*
   * No tuples in prop-types… if it existed, screens would look like this:
   *
   * PropTypes.tuple([
   *
   *   // string or function
   *   PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
   *
   *   // component
   *   PropTypes.func,
   * ])
   */
  screens: PropTypes.arrayOf(PropTypes.any).isRequired,
})
