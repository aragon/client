import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, IdentityBadge, Viewport, breakpoint } from '@aragon/ui'
import { TextLabel } from '../../../components/TextStyles'
import { GU } from '../../../utils'
import { MENU_PANEL_WIDTH } from '../../../components/MenuPanel/MenuPanel'
import Screenshots from '../Screenshots'

// Exclude the width of MenuPanel
const appAbove = (above, value) =>
  above(value + (above('medium') ? MENU_PANEL_WIDTH : 0))
const appBelow = (below, value) =>
  below(value + (below('medium') ? 0 : MENU_PANEL_WIDTH))

const AppContent = React.memo(
  ({
    app: { appName, name, icon, description, screenshots, canUpgrade },
    appVersions,
  }) => (
    <Viewport>
      {({ below, breakpoints }) => (
        <div
          css={`
            padding: ${6 * GU}px ${4 * GU}px ${8 * GU}px;
          `}
        >
          <div
            css={`
              display: flex;
              justify-content: space-between;
              margin-bottom: ${6 * GU}px;
              overflow: hidden;

              flex-direction: ${appBelow(below, breakpoints.medium)
                ? 'column'
                : 'row'};

              align-items: ${appBelow(below, breakpoints.medium)
                ? 'flex-start'
                : 'flex-end'};
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
                padding: ${appBelow(below, breakpoints.medium)
                  ? `${3 * GU}px 0 0 ${80 + 3 * GU}px`
                  : '0'};
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

              flex-direction: ${appBelow(below, breakpoints.medium)
                ? 'column'
                : 'row'};
            `}
          >
            <DetailsGroup compact={appBelow(below, breakpoints.medium)}>
              <Heading2>Description</Heading2>
              <div>{description}</div>
              <Heading2>Source code</Heading2>
              <div>http://github.com/xyz</div>
              <Heading2>Permissions</Heading2>
              <div>View permissions</div>
            </DetailsGroup>
            <DetailsGroup compact={appBelow(below, breakpoints.medium)}>
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
      )}
    </Viewport>
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
  width: ${p => (p.compact ? '100%' : '50%')};
  & + & {
    margin-left: ${p => (p.compact ? '0' : `${5 * GU}px`)};
  }
`

export default AppContent
