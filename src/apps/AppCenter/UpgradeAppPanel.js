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
import { AppType } from '../../prop-types'
import { TextLabel } from '../../components/TextStyles'
import { GU } from '../../utils'

class UpgradeAppPanel extends React.PureComponent {
  static propTypes = {
    app: AppType,
    onClose: PropTypes.func.isRequired,
  }
  state = {
    app: null,
  }
  static getDerivedStateFromProps(props, state) {
    if (props.app !== state.app && props.app) {
      return { app: props.app }
    }
    return {}
  }
  render() {
    const { app } = this.state
    const { app: propsApp, onClose } = this.props

    if (!app) {
      return null
    }

    const { name, versions, version, sourceUrl } = app
    const currentVersion = versions.find(({ name }) => version === name)
    const latestVersion = versions[0]

    return (
      <SidePanel
        title={`Upgrade “${name || 'Unknown'}”`}
        opened={Boolean(propsApp)}
        onClose={onClose}
      >
        <SidePanelSplit>
          <div>
            <Heading2>Current version</Heading2>
            <div>{currentVersion.name}</div>
          </div>
          <div>
            <Heading2>New version</Heading2>
            <div>{latestVersion.name}</div>
          </div>
        </SidePanelSplit>

        <Part>
          <Heading2>Changelog</Heading2>
          <p>
            {latestVersion.changelogUrl ? (
              <SafeLink href={latestVersion.changelogUrl}>
                {latestVersion.changelogUrl}
              </SafeLink>
            ) : (
              'There is no changelog for this version.'
            )}
          </p>

          <Heading2>Source code</Heading2>
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
          <p>This upgrade doesn’t add any new permission.</p>
        </Part>

        <SidePanelSeparator />

        <Part>
          <div
            css={`
              margin: ${4 * GU}px 0 ${2 * GU}px;
            `}
          >
            <Button mode="strong" wide>
              Upgrade
            </Button>
          </div>

          <Info.Action>
            All the “{name}” app instances will be upgraded.
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
