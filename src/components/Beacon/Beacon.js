import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

const HELPSCOUT_BEACON = 'helpscout-beacon'
const BEACON_EMBED =
  '!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});'
const BEACON_INIT =
  "window.Beacon('init', '163e0284-762b-4e2d-b3b3-70a73a7e6c9f')"

const Beacon = ({ load = false, onOptIn }) => {
  return load ? (
    <Helmet>
      <script type="text/javascript">{BEACON_EMBED}</script>
      <script type="text/javascript">{BEACON_INIT}</script>
    </Helmet>
  ) : (
    <OptIn onOptIn={onOptIn} />
  )
}

Beacon.propTypes = {
  load: PropTypes.bool,
  onOptIn: PropTypes.func.isRequired,
}

Beacon.defaultProps = {
  load: false,
}

const OptIn = ({ onOptIn }) => {
  return (
    <button
      onClick={onOptIn}
      css={`
        position: absolute;
        z-index: 1001;
        bottom: 16px;
        right: 16px;
      `}
    >
      Opt in
    </button>
  )
}

OptIn.propTypes = {
  onOptIn: PropTypes.func.isRequired,
}

export { HELPSCOUT_BEACON }
export default Beacon
