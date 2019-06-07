import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { GU } from '../../utils'
import { createGlobalStyle } from 'styled-components'

const BEACON_EMBED =
  '!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});'
const HELPSCOUT_ID = '163e0284-762b-4e2d-b3b3-70a73a7e6c9f'

function useHelpScoutBeacon(optedIn) {
  const [beaconInit, setBeaconInit] = useState(false)

  // Load the script if it doesn’t exist yet and optedIn
  // is true, then set the value of Beacon.
  useEffect(() => {
    let script

    if (optedIn && !beaconInit) {
      if (!window.Beacon) {
        script = document.createElement('script')
        script.innerHTML = BEACON_EMBED
        document.body.appendChild(script)
      }
      window.Beacon('init', HELPSCOUT_ID)
      setBeaconInit(true)
    }

    return () => script.remove()
  }, [optedIn, beaconInit])

  const beacon = useCallback(
    (...params) => {
      if (window.Beacon && optedIn && beaconInit) {
        window.Beacon(...params)
      }
    },
    [optedIn, beaconInit]
  )

  return beacon
}

const BeaconHeadScripts = ({ optedIn }) => {
  return optedIn ? <HelpscoutStyle /> : null
}

BeaconHeadScripts.propTypes = {
  optedIn: PropTypes.bool,
}

BeaconHeadScripts.defaultProps = {
  optedIn: false,
}

const HelpscoutStyle = createGlobalStyle`
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
`
export { useHelpScoutBeacon }
export default BeaconHeadScripts
