import React from 'react'
import { EthIdenticon, IdentityBadge } from '@aragon/ui'

const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'

const EmptyCustomLabels = () => (
  <React.Fragment>
    <h3>Start adding labels</h3>
    <div>
      You can add labels by clicking on the{' '}
      <div
        css={`
          display: inline-block;
          align-items: center;
          border-radius: 3px;
          overflow: hidden;
          height: 22px;
        `}
      >
        <EthIdenticon
          address={ETH_ADDRESS}
          css={`
            position: relative;
            z-index: 1;
          `}
        />
        <IdentityBadge
          css={`
            position: relative;
            left: -3px;
          `}
          entity="Address badge"
        />
      </div>
      anywhere in the app, or importing a .json file with labels by clicking
      "Import" below.
    </div>
    <button>Import</button>
  </React.Fragment>
)

export default EmptyCustomLabels
