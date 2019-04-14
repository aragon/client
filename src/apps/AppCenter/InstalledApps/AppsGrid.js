import React from 'react'
import PropTypes from 'prop-types'
import { breakpoint, font } from '@aragon/ui'

const AppsGrid = React.memo(({ children }) => (
  <div>
    <h1
      css={`
        margin: 0 0 20px;
        ${font({ weight: 'bold' })};
      `}
    >
      Installed apps
    </h1>
    <div
      css={`
        display: grid;
        grid-template-columns: repeat(auto-fill, 230px);
        grid-gap: 35px 45px;
        justify-items: center;
        width: 100%;
        justify-content: space-evenly;

        ${breakpoint(
          'medium',
          `
            justify-content: start;
          `
        )};
      `}
    >
      {children}
    </div>
  </div>
))

AppsGrid.propTypes = {
  children: PropTypes.node,
}

export default AppsGrid
