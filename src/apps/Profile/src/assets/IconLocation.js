import React from 'react'
import PropTypes from 'prop-types'

const IconLocation = props => (
  <svg width="29px" height="40px" viewBox="0 0 29 40" {...props}>
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="noun_Location_1355745" fill={props.color} fillRule="nonzero">
        <path
          d="M14.5,0.164772727 C9.29273612,0.165037939 4.49512356,2.98904104 1.96753157,7.54171893 C-0.560060428,12.0943968 -0.420084153,17.6596898 2.33318182,22.0795455 L14.5,39.875 L26.6668182,22.0795455 C29.4200842,17.6596898 29.5600604,12.0943968 27.0324684,7.54171893 C24.5048764,2.98904104 19.7072639,0.165037939 14.5,0.164772727 Z M14.5,19.7727273 C11.5879531,19.7727273 9.22727273,17.4120469 9.22727273,14.5 C9.22727273,11.5879531 11.5879531,9.22727273 14.5,9.22727273 C17.4120469,9.22727273 19.7727273,11.5879531 19.7727273,14.5 C19.7727273,15.8984142 19.2172094,17.239553 18.2283812,18.2283812 C17.239553,19.2172094 15.8984142,19.7727273 14.5,19.7727273 Z"
          id="Shape"
        />
      </g>
    </g>
  </svg>
)

IconLocation.propTypes = {
  color: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
}

IconLocation.defaultProps = {
  color: '#222',
  width: '29px',
  height: '40px',
}

export default IconLocation
