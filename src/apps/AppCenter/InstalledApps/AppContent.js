import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Button,
  SafeLink,
  blockExplorerUrl,
  useViewport,
  theme,
} from '@aragon/ui'
import AppIcon from '../../../components/AppIcon/AppIcon'
import LocalIdentityBadge from '../../../components/IdentityBadge/LocalIdentityBadge'
import { MENU_PANEL_WIDTH } from '../../../components/MenuPanel/MenuPanel'
import { TextLabel } from '../../../components/TextStyles'
import Markdown from '../../../components/Markdown/Markdown'
import { RepoType } from '../../../prop-types'
import { GU } from '../../../utils'
import { useRepoDetails } from '../../../hooks'
import { network } from '../../../environment'
import Screenshots from '../Screenshots'

// Exclude the width of MenuPanel
const appBelow = (below, value) =>
  below(value + (below('medium') ? 0 : MENU_PANEL_WIDTH))

const AppContent = React.memo(({ repo, repoVersions, onRequestUpgrade }) => {
  const {
    name,
    instances,
    baseUrl,
    currentVersion,
    latestVersion: {
      content: {
        author,
        icons,
        description = 'No description.',
        screenshots = [],
        source_url: sourceUrl,
        details_url: detailsUrl,
      },
      version: latestVersion,
    },
    repoAddress,
    repoName,
  } = repo
  const repoDetails = useRepoDetails(baseUrl, detailsUrl)
  const canUpgrade = currentVersion.version !== latestVersion
  const { below, breakpoints } = useViewport()
  const compact = appBelow(below, breakpoints.medium)

  return (
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
          flex-direction: ${compact ? 'column' : 'row'};
          align-items: ${compact ? 'flex-start' : 'flex-end'};
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <div
            css={`
              margin: 0 ${3 * GU}px 0 0;
            `}
          >
            <AppIcon app={{ baseUrl, icons }} size={80} />
          </div>
          <div>
            <h1
              css={`
                white-space: nowrap;
                margin-bottom: ${1 * GU}px;
                font-size: 22px;
              `}
            >
              {name}
            </h1>

            {author && (
              <React.Fragment>
                <Heading2>Created by</Heading2>
                <div>
                  <LocalIdentityBadge entity={author} />
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
        <div
          css={`
            padding: ${compact ? `${3 * GU}px 0 0 ${80 + 3 * GU}px` : '0'};
          `}
        >
          {canUpgrade && onRequestUpgrade && (
            <Button mode="strong" onClick={onRequestUpgrade}>
              Upgrade
            </Button>
          )}
        </div>
      </div>
      {screenshots.length > 0 && (
        <Screenshots repo={repo} screenshots={screenshots} />
      )}
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;
          flex-direction: ${compact ? 'column' : 'row'};
        `}
      >
        <DetailsGroup compact={compact}>
          <Heading2>Description</Heading2>
          <div>{description}</div>

          {!!repoDetails && (
            <React.Fragment>
              <Heading2>Details</Heading2>
              <Markdown text={repoDetails} />
            </React.Fragment>
          )}
        </DetailsGroup>
        <DetailsGroup compact={compact}>
          <Heading2>Installed instances</Heading2>
          {instances.map(({ proxyAddress }) => (
            <div
              key={proxyAddress}
              css={`
                & + & {
                  margin-top: ${2 * GU}px;
                }
              `}
            >
              <LocalIdentityBadge entity={proxyAddress} />
            </div>
          ))}

          <Heading2>Source code</Heading2>
          <div>
            {sourceUrl ? (
              <StyledLink href={sourceUrl}>{sourceUrl}</StyledLink>
            ) : (
              'No source code link.'
            )}
          </div>

          {!!repoAddress && !!repoAddress && (
            <React.Fragment>
              <Heading2>Package Name</Heading2>
              <StyledLink
                href={blockExplorerUrl('address', repoAddress, {
                  networkType: network.type,
                })}
              >
                {repoName}
              </StyledLink>
            </React.Fragment>
          )}

          {repoVersions && (
            <div
              css={`
                margin-top: ${2 * GU}px;
              `}
            >
              {repoVersions}
            </div>
          )}
        </DetailsGroup>
      </div>
    </div>
  )
})

AppContent.propTypes = {
  repo: RepoType.isRequired,
  repoVersions: PropTypes.node,
  onRequestUpgrade: PropTypes.func,
}

const StyledLink = styled(SafeLink).attrs({ target: '_blank' })`
  text-decoration: none;
  color: ${theme.accent};

  &:hover {
    text-decoration: underline;
  }
`

const Heading2 = ({ children }) => (
  <h2
    css={`
      margin-top: ${1 * GU}px;
      margin-bottom: ${GU}px;
    `}
  >
    <TextLabel>{children}</TextLabel>
  </h2>
)

Heading2.propTypes = {
  children: PropTypes.node,
}

const DetailsGroup = styled.div`
  width: ${p => (p.compact ? '100%' : '50%')};
  & + & {
    margin-left: ${p => (p.compact ? '0' : `${5 * GU}px`)};
  }
`

export default AppContent
