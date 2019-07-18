import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { noop, GU } from '../../utils'

const BEACON_EMBED =
  '!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});'
const HELPSCOUT_ID = "'163e0284-762b-4e2d-b3b3-70a73a7e6c9f'"
const BEACON_INIT = "window.Beacon('init'," + HELPSCOUT_ID + ')'

const BeaconHeadScripts = React.memo(({ optedIn, onReady }) => {
  useEffect(() => {
    let timeout = null
    if (optedIn) {
      ;(function isBeaconReady() {
        if (window.Beacon) {
          onReady()
          return
        }
        timeout = setTimeout(isBeaconReady, 100)
      })()

      return () => clearTimeout(timeout)
    }
  }, [optedIn, onReady])

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
          #beacon-container .Beacon div:first-of-type {
            display: none !important;
          }
          @media (min-width: 768px) {
            #beacon-container .BeaconContainer {
              height: 600px !important;
              width: 350px !important;
              top: unset !important;
              left: unset !important;
              bottom: 80px !important;
              right: ${3 * GU}px !important;
            }
          }
        `}
      </style>
    </Helmet>
  )
})

BeaconHeadScripts.propTypes = {
  optedIn: PropTypes.bool,
  onReady: PropTypes.func,
}

BeaconHeadScripts.defaultProps = {
  optedIn: false,
  onReady: noop,
}

export default BeaconHeadScripts
