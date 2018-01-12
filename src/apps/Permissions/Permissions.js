import React from 'react'
import { styled, AppBar, SidePanel, Button, Text } from '@aragon/ui'
import List from './List'
import AssignPermission from './AssignPermission'
import InstancePermissions from './InstancePermissions'
import Badge from '../../components/Badge/Badge'
import { permissions } from '../../demo-state'

const { entities, actions, assigned } = permissions

class Permissions extends React.Component {
  state = {
    assignOpened: false,
    currentInstance: null,
  }
  componentDidMount() {
    this.updateParams(this.props.params)
  }
  componentWillReceiveProps(nextProps) {
    this.updateParams(nextProps.params)
  }
  updateParams(params) {
    if (!params) {
      this.setState({ currentInstance: null })
      return
    }
    const { appId, instanceId } = params
    const instance = this.getInstance(appId, instanceId)

    this.setState({
      currentInstance: instance || null,
    })
  }
  getInstance(appId, instanceId) {
    const { apps } = this.props
    const app = apps.find(({ id }) => id === appId)
    if (!app) {
      return null
    }
    const instance = app.instances.find(({ id }) => id === instanceId)
    if (!instance) {
      return null
    }

    return {
      appId,
      appName: app.name,
      instanceId,
      instanceName: instance.name,
    }
  }

  // Transforms the apps list into a list of app instances,
  // ready to be displayed in List.
  getAppItems(apps) {
    return apps
      .filter(({ id }) => id !== 'permissions' && id !== 'identity')
      .reduce(
        (items, { id, name, instances, alwaysDisplayInstances }) =>
          items.concat(
            instances.map(instance => ({
              id: `${id}__${instance.id}`,
              label: name,
              badge: alwaysDisplayInstances
                ? { label: instance.name, style: 'app' }
                : null,
            }))
          ),
        []
      )
  }
  handleAssignClick = () => {
    this.setState({
      assignOpened: true,
    })
  }
  handleAssignPanelClose = () => {
    this.setState({
      assignOpened: false,
    })
  }
  handleInstanceClick = id => {
    const [appId, instanceId] = id.split('__')
    this.props.onParamsRequest({ appId, instanceId })
  }
  handleAppBarTitleClick = () => {
    this.props.onParamsRequest()
  }
  renderHome() {
    const { apps } = this.props
    const appItems = this.getAppItems(apps)
    return (
      <Content>
        <ContentColumn>
          <List
            title="Apps"
            items={appItems}
            onClick={this.handleInstanceClick}
          />
        </ContentColumn>
        <ContentColumn>
          <List title="Entities" items={entities} />
        </ContentColumn>
      </Content>
    )
  }
  render() {
    const { apps } = this.props
    const { currentInstance, assignOpened } = this.state
    const appItems = this.getAppItems(apps)
    return (
      <Main>
        <AppBarWrapper>
          <AppBar
            title="Permissions"
            onTitleClick={currentInstance ? this.handleAppBarTitleClick : null}
            endContent={
              !currentInstance && (
                <Button mode="strong" onClick={this.handleAssignClick}>
                  Assign Permission
                </Button>
              )
            }
          >
            {currentInstance && (
              <AppBarContent>
                <Text size="xxlarge">{currentInstance.appName}</Text>
                <span>
                  <Badge aspect="app">{currentInstance.instanceName}</Badge>
                </span>
              </AppBarContent>
            )}
          </AppBar>
        </AppBarWrapper>
        <ScrollWrapper>
          <AppWrapper>
            {currentInstance ? (
              <InstancePermissions
                actions={actions}
                assigned={assigned}
                instance={currentInstance}
              />
            ) : (
              this.renderHome()
            )}
          </AppWrapper>
        </ScrollWrapper>
        <SidePanel
          title="Assign Permission"
          opened={assignOpened}
          onClose={this.handleAssignPanelClose}
        >
          <AssignPermission
            onDone={this.handleAssignPanelClose}
            entities={apps
              .find(({ id }) => id === 'groups')
              .instances.map(({ name }) => `Groups (${name})`)}
            calls={appItems.map(
              ({ label, badge }) =>
                `${label}${badge ? ` (${badge.label})` : ''}`
            )}
            actions={appItems.map(
              ({ label, badge }) =>
                `${label}${badge ? ` (${badge.label})` : ''}`
            )}
          />
        </SidePanel>
      </Main>
    )
  }
}

const Main = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
`

const AppBarWrapper = styled.div`
  flex-shrink: 0;
`

const AppBarContent = styled.div`
  display: flex;
  align-items: center;
  & > *:first-child {
    margin-right: 10px;
  }
`

const ScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  overflow: auto;
  flex-grow: 1;
`

const AppWrapper = styled.div`
  flex-grow: 1;
  min-height: min-content;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
`

const Content = styled.div`
  display: flex;
  width: 100%;
  min-width: 600px;
  padding: 40px;
`

const ContentColumn = styled.div`
  width: 50%;
  & + & {
    margin-left: 30px;
  }
`

export default Permissions
