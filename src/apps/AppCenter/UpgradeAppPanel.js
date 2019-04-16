import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Button,
  Info,
  SafeLink,
  SidePanel,
  SidePanelSeparator,
  SidePanelSplit,
} from '@aragon/ui'
import { RepoType } from '../../prop-types'
import { TextLabel } from '../../components/TextStyles'
import { GU } from '../../utils'

class UpgradeAppPanel extends React.PureComponent {
  static propTypes = {
    repo: RepoType,
    onClose: PropTypes.func.isRequired,
  }
  state = {
    repo: null,
  }
  static getDerivedStateFromProps(props, state) {
    // `repo` is saved in the state, so that the selected app
    // can still be visible while the panel is being closed.
    if (props.repo !== state.repo && props.repo) {
      return { repo: props.repo }
    }
    return {}
  }
  render() {
    const { repo } = this.state
    const { repo: propsRepo, onClose } = this.props

    if (!repo) {
      return null
    }

    const { currentVersion, latestVersion } = repo
    const {
      name,
      changelog_url: changelogUrl,
      source_url: sourceUrl,
    } = repo.latestVersion.content

    return (
      <SidePanel
        title={`Upgrade “${name || 'Unknown'}”`}
        opened={Boolean(propsRepo)}
        onClose={onClose}
      >
        <SidePanelSplit>
          <div>
            <Heading2>Current version</Heading2>
            <div>{currentVersion.version}</div>
          </div>
          <div>
            <Heading2>New version</Heading2>
            <div>{latestVersion.version}</div>
          </div>
        </SidePanelSplit>

        <Part>
          <Heading2>Changelog</Heading2>
          <p>
            {changelogUrl ? (
              <SafeLink href={changelogUrl} target="_blank">
                {changelogUrl}
              </SafeLink>
            ) : (
              'There is no changelog for this version.'
            )}
          </p>

          <Heading2>Source code</Heading2>
          <p>
            {sourceUrl ? (
              <SafeLink href={sourceUrl} target="_blank">
                {sourceUrl}
              </SafeLink>
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
              margin: ${4 * GU}px 0 ${2 * GU}px;
            `}
          >
            <Button mode="strong" disabled wide>
              Upgrade
            </Button>
          </div>

          <Info.Action>
            All the “{name}” app instances installed on your organization will
            be upgraded.
          </Info.Action>
        </Part>
      </SidePanel>
    )
  }
}

const Heading2 = styled(TextLabel).attrs({ as: 'h2' })`
  white-space: nowrap;
`

const Part = styled.div`
  padding: ${GU}px 0 ${3 * GU}px;
  h2 {
    margin: ${2 * GU}px 0 ${GU}px;
  }
`

export default UpgradeAppPanel
