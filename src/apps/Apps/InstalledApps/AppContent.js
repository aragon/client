import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, IdentityBadge, breakpoint } from '@aragon/ui'
import { TextLabel } from '../../../components/TextStyles'
import Screenshots from '../Screenshots'
import { GU } from '../../../utils'

const AppContent = React.memo(
  ({
    app: { appName, name, icon, description, screenshots, canUpgrade },
    appVersions,
  }) => (
    <div
      css={`
        padding: ${6 * GU}px ${8 * GU}px ${8 * GU}px ${4 * GU}px;
      `}
    >
      <div
        css={`
          display: flex;
          justify-content: space-between;
          margin-bottom: ${6 * GU}px;
          overflow: hidden;

          flex-direction: column;
          align-items: flex-start;

          ${breakpoint(
            'large',
            `
              flex-direction: row;
              align-items: flex-end;
            `
          )};
        `}
      >
        <div
          css={`
            display: flex;
            align-items: flex-end;
          `}
        >
          <div
            css={`
              margin: ${GU}px ${3 * GU}px 0 0;
            `}
          >
            <img
              alt=""
              src={icon}
              width="80"
              height="80"
              css={`
                display: block;
                width: 80px;
                height: 80px;
              `}
            />
          </div>
          <div>
            <h1
              css={`
                white-space: nowrap;
                margin-bottom: -${GU}px;
                font-size: 22px;
              `}
            >
              {name}
            </h1>

            <Heading2>Created by</Heading2>
            <div>
              <IdentityBadge entity="0x2c9341a32cfa3f2c2554ca1803134137b9366b3c" />
            </div>
          </div>
        </div>
        <div
          css={`
            padding: ${3 * GU}px 0 0 ${80 + 3 * GU}px;
            ${breakpoint(
              'large',
              `
                padding: 0;
              `
            )};
          `}
        >
          <Button mode="strong">Upgrade</Button>
        </div>
      </div>
      <div>
        <Screenshots screenshots={screenshots} />
      </div>
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;
          ${breakpoint(
            'large',
            `
              flex-direction: row;
            `
          )};
        `}
      >
        <DetailsGroup>
          <Heading2>Description</Heading2>
          <div>{description}</div>
          <Heading2>Source code</Heading2>
          <div>http://github.com/xyz</div>
          <Heading2>Permissions</Heading2>
          <div>View permissions</div>
        </DetailsGroup>
        <DetailsGroup>
          <Heading2>Installed instances</Heading2>
          <div>0x…</div>
          <div
            css={`
              margin-top: ${2 * GU}px;
            `}
          >
            {appVersions}
          </div>
        </DetailsGroup>
      </div>
    </div>
  )
)

AppContent.propTypes = {
  app: PropTypes.shape({
    appName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    description: PropTypes.string.isRequired,
    canUpgrade: PropTypes.bool,
  }).isRequired,
}

const Heading2 = ({ children }) => (
  <h2
    css={`
      margin-top: ${2 * GU}px;
      margin-bottom: ${GU}px;
    `}
  >
    <TextLabel>{children}</TextLabel>
  </h2>
)

const DetailsGroup = styled.div`
  flex-shrink: 0;
  width: 100%;

  ${breakpoint(
    'large',
    `
      width: 300px;
    `
  )};
`

export default AppContent
