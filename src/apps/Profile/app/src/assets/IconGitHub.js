import React from 'react'
import PropTypes from 'prop-types'

const IconGitHub = props => (
  <svg width="24px" height="24px" viewBox="0 0 24 24" {...props}>
    <path
      d="M12 0C5.36 0 0 5.36 0 11.999c0 5.28 3.44 9.759 8.24 11.359.64.08.8-.24.8-.56v-2.08c-3.36.72-4.08-1.6-4.08-1.6-.56-1.36-1.36-1.76-1.36-1.76-1.12-.72.08-.72.08-.72 1.2.08 1.84 1.2 1.84 1.2 1.04 1.84 2.8 1.28 3.52.96.08-.8.4-1.28.8-1.6-2.64-.32-5.44-1.36-5.44-5.92C4.4 10 4.88 8.88 5.6 8.08c-.16-.32-.56-1.52.08-3.2 0 0 1.04-.32 3.28 1.2.96-.24 2-.4 3.04-.4s2.08.16 3.04.4c2.32-1.52 3.28-1.2 3.28-1.2.64 1.68.24 2.88.08 3.2.8.8 1.2 1.92 1.2 3.2 0 4.64-2.8 5.6-5.44 5.92.4.4.8 1.12.8 2.239v3.28c0 .32.24.72.8.56 4.8-1.6 8.16-6.08 8.16-11.36C24 5.36 18.64 0 12 0z"
      fill={props.color}
    />
  </svg>
)

IconGitHub.propTypes = {
  color: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
}

IconGitHub.defaultProps = {
  color: '#222',
  width: '24px',
  height: '24px',
}

export default IconGitHub
