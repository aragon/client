import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { GU } from '../../utils'

const BEACON_EMBED =
  '!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});'
const HELPSCOUT_ID = "'163e0284-762b-4e2d-b3b3-70a73a7e6c9f'"
const BEACON_INIT = "window.Beacon('init'," + HELPSCOUT_ID + ')'

const BeaconHeadScripts = ({ optedIn }) => {
  if (!optedIn) {
    return null
  }

  return (
    <Helmet>
      <script type="text/javascript">{BEACON_EMBED}</script>
      <script type="text/javascript">{BEACON_INIT}</script>
      <style>
        {`
          .BeaconFabButtonFrame,
          .c-BeaconCloseButton,
          #beacon-container .Beacon div:first-of-type {
            display: none !important;
          }
          #beacon-container .BeaconContainer {
            height: calc(100vh - 90px - 48px) !important;
            max-height: calc(100vh - 90px - 48px) !important;
            width: calc(100vw - 32px) !important;
            top: ${6 * GU}px !important;
            left: ${2 * GU}px !important;
          }
          @media (min-width: 768px) {
            #beacon-container .BeaconContainer {
              height: 600px !important;
              width: 350px !important;
              top: unset !important;
              left: unset !important;
              bottom: 100px !important;
              right: ${3 * GU}px !important;
            }
          }
        `}
      </style>
    </Helmet>
  )
}

BeaconHeadScripts.propTypes = {
  optedIn: PropTypes.bool,
}

BeaconHeadScripts.defaultProps = {
  optedIn: false,
}

export default BeaconHeadScripts
