import React from 'react'
import PropTypes from 'prop-types'
import { ButtonBase, GU, useTheme, useViewport } from '@aragon/ui'
import eagleSvg from '../../assets/eagle.svg'
import logo from '../../assets/logo.png'

const EAGLE_DIMENSIONS = [1307, 877]

function ErrorScreen({ children }) {
  const theme = useTheme()
  const { width: vw } = useViewport()
  const compact = vw < 720

  return (
    <div
      css={`
        height: 100vh;
        min-width: ${45 * GU}px;
        overflow: auto;
        background: ${theme.background} fixed 50% 100% /
          ${EAGLE_DIMENSIONS[0]}px ${EAGLE_DIMENSIONS[1]}px no-repeat
          url(${eagleSvg});
      `}
    >
      <ButtonBase
        href="/"
        external={false}
        css={`
          position: absolute;
          top: ${2 * GU}px;
          left: ${2 * GU}px;
          opacity: ${Number(!compact)};
          transition: opacity 50ms;
        `}
      >
        <img src={logo} alt="Aragon" width={4.5 * GU} height={4.25 * GU} />
      </ButtonBase>
      <div
        css={`
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 50px 20px 20px;
          min-height: 100%;
        `}
      >
        {children}
      </div>
    </div>
  )
}

ErrorScreen.propTypes = {
  children: PropTypes.node,
}

export default ErrorScreen
