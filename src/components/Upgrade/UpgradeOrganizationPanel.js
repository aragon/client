import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Button,
  Info,
  SafeLink,
  SidePanel,
  SidePanelSeparator,
  SidePanelSplit,
  blockExplorerUrl,
} from '@aragon/ui'
// import { RepoType } from '../../prop-types'
import { TextLabel } from '../../components/TextStyles'
import AppIcon from '../../components/AppIcon/AppIcon'
import { GU } from '../../utils'
import { networkType } from '../../environment'

import iconFinance from './assets/icons/finance.svg'
import iconTokenManager from './assets/icons/token-manager.svg'
import iconVault from './assets/icons/vault.svg'
import iconVoting from './assets/icons/voting.svg'

const VERSION = '0.7 Bella'

const KNOWN_ICONS = new Map([
  [
    '0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae',
    iconFinance,
  ],
  [
    '0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f',
    iconTokenManager,
  ],
  [
    '0x7e852e0fcfce6551c13800f1e7476f982525c2b5277ba14b24339c68416336d1',
    iconVault,
  ],
  [
    '0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4',
    iconVoting,
  ],
])

function getBaseUrlFromAppId(appId, apps) {
  const app = apps.find(app => app.appId === appId)
  return (app && app.baseUrl) || null
}

function getAppVersionData({ content, version }, apps) {
  return {
    appId: content.appId,
    baseUrl: getBaseUrlFromAppId(content.appId, apps),
    contractAddress: content.contractAddress,
    icons: content.icons,
    knownIcon: KNOWN_ICONS.has(content.appId)
      ? KNOWN_ICONS.get(content.appId)
      : null,
    name: content.name,
    version,
  }
}

const UpgradeOrganizationPanel = React.memo(
  ({ apps = [], repos = [], opened, onClose }) => {
    const name = undefined
    const changelogUrl = 'http://changelog.url'
    const sourceUrl = 'http://source.url'

    const [currentVersions, newVersions] = useMemo(
      () =>
        repos.reduce(
          (results, repo) => [
            [...results[0], getAppVersionData(repo.currentVersion, apps)],
            [...results[1], getAppVersionData(repo.latestVersion, apps)],
          ],
          [[], []]
        ),
      [repos, apps]
    )

    return (
      <SidePanel
        title={`Upgrade to ${VERSION}`}
        opened={opened}
        onClose={onClose}
      >
        <SidePanelSplit>
          <div>
            <Heading2>Current version</Heading2>
            <div>
              {currentVersions.map(appVersion => (
                <AppVersion key={appVersion.appId} {...appVersion} />
              ))}
            </div>
          </div>
          <div>
            <Heading2>New version</Heading2>
            {newVersions.map(appVersion => (
              <AppVersion key={appVersion.appId} {...appVersion} />
            ))}
          </div>
        </SidePanelSplit>

        <Part>
          <Heading2>Source code</Heading2>
          <p>
            {sourceUrl ? (
              <SafeLink href={sourceUrl}>{sourceUrl}</SafeLink>
            ) : (
              'There is no available source for this app.'
            )}
          </p>

          <Heading2>Aragon official registry</Heading2>
          <p>
            {sourceUrl ? (
              <SafeLink href={sourceUrl}>{sourceUrl}</SafeLink>
            ) : (
              'There is no available source for this app.'
            )}
          </p>
        </Part>

        <SidePanelSeparator />
        <Part>
          <Heading2>Permissions</Heading2>
          <p>This upgrade doesn’t introduce any new permissions.</p>
        </Part>

        <SidePanelSeparator />

        <Part>
          <div
            css={`
              margin: ${2 * GU}px 0;
            `}
          >
            <Info.Action title="Action to be triggered">
              <p
                css={`
                  margin-top: ${GU}px;
                  font-size: 15px;
                `}
              >
                All your app instances will be upgraded to Aragon {VERSION}.
              </p>
            </Info.Action>
          </div>
          <div
            css={`
              margin: ${2 * GU}px 0;
            `}
          >
            <Button mode="strong" disabled wide>
              Upgrade your organization
            </Button>
          </div>
        </Part>
      </SidePanel>
    )
  }
)

UpgradeOrganizationPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
}

const AppVersion = ({
  baseUrl,
  contractAddress,
  icons,
  knownIcon,
  name,
  version,
}) => {
  const major = version.split('.')[0]
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        margin: 10px 0;
      `}
    >
      <div
        css={`
          width: 20px;
          margin-right: 5px;
        `}
      >
        {major || version}
      </div>
      <SafeLink
        href={blockExplorerUrl('address', contractAddress, { networkType })}
        css={`
          display: flex;
          background: #daeaef;
          border-radius: 3px;
          align-items: center;
          height: 22px;
          align-items: center;
          text-decoration: none;
        `}
      >
        <AppIcon
          app={{ baseUrl, icons }}
          src={knownIcon || undefined}
          radius={3}
        />
        <div
          css={`
            padding: 0 5px;
          `}
        >
          {name}
        </div>
      </SafeLink>
    </div>
  )
}

const Heading2 = styled(TextLabel).attrs({ as: 'h2' })`
  white-space: nowrap;
`

const Part = styled.div`
  padding: ${GU}px 0 ${3 * GU}px;
  ${Heading2} {
    margin: ${2 * GU}px 0 ${GU}px;
  }
`

export default UpgradeOrganizationPanel
