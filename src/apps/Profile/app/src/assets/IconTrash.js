import React from 'react'
import PropTypes from 'prop-types'

const IconTrash = props => (
  <svg width="20px" height="23px" viewBox="0 0 20 23" {...props}>
    <g
      id="Home-app"
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
    >
      <g
        id="Profile-Landing-Copy"
        transform="translate(-480.000000, -1011.000000)"
        fill={props.color}
      >
        <g
          id="Trash-icon-Copy-2"
          transform="translate(480.000000, 1012.000000)"
        >
          <path
            d="M14.5008696,4.965625 L5.50086957,4.965625 L5.50086957,1.0924375 C5.50086957,0.49 5.9873913,0 6.58608696,0 L13.4147826,0 C14.0134783,0 14.5008696,0.49 14.5008696,1.0924375 L14.5008696,4.965625 Z M6.37043478,4.090625 L13.6313043,4.090625 L13.6313043,1.0924375 C13.6313043,0.9725625 13.533913,0.875 13.4147826,0.875 L6.58608696,0.875 C6.4673913,0.875 6.37043478,0.9725625 6.37043478,1.0924375 L6.37043478,4.090625 Z"
            id="Shape"
            stroke={process.color}
            strokeWidth="0.3"
          />
          <path
            d="M17.073913,21 L2.9273913,21 C2.32913043,21 1.84217391,20.51 1.84217391,19.9075625 L1.84217391,5.182625 C1.84217391,4.580625 2.32913043,4.090625 2.9273913,4.090625 L17.073913,4.090625 C17.6726087,4.090625 18.16,4.580625 18.16,5.182625 L18.16,19.9075625 C18.16,20.51 17.6721739,21 17.073913,21 Z M2.9273913,4.965625 C2.80869565,4.965625 2.71173913,5.0631875 2.71173913,5.182625 L2.71173913,19.9075625 C2.71173913,20.0274375 2.80826087,20.125 2.9273913,20.125 L17.073913,20.125 C17.1930435,20.125 17.2904348,20.0274375 17.2904348,19.9075625 L17.2904348,5.182625 C17.2904348,5.0631875 17.1930435,4.965625 17.073913,4.965625 L2.9273913,4.965625 Z"
            id="Shape"
            stroke={process.color}
            strokeWidth="0.3"
          />
          <rect
            id="Rectangle-path"
            x="0.0813043478"
            y="3.8"
            width="19.8369565"
            height="1.3"
          />
          <g id="Group" transform="translate(5.652174, 7.875000)">
            <rect
              id="Rectangle-path"
              x="3.91391304"
              y="0.1299375"
              width="1.2"
              height="8.9985"
            />
            <polygon
              id="Rectangle-path"
              points="0.0117391304 0.1299375 1.21173913 0.1299375 1.21173913 9.1284375 0.0117391304 9.1284375"
            />
            <rect
              id="Rectangle-path"
              x="7.81608696"
              y="0.1299375"
              width="1.2"
              height="8.9985"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
)

IconTrash.propTypes = {
  color: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
}

IconTrash.defaultProps = {
  color: '#106CE3',
  width: '20px',
  height: '23px',
}

export default IconTrash
