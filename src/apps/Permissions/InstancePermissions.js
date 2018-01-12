import React from 'react'
import { styled, theme, Text } from '@aragon/ui'
import ColumnSection from '../../components/ColumnSection/ColumnSection'
import ExpandableBox from '../../components/ExpandableBox/ExpandableBox'
import Badge from '../../components/Badge/Badge'
import RevokeFooter from './RevokeFooter'

class InstancePermissions extends React.Component {
  handleRevoke = permissionId => {
    console.log(`Revoke ${permissionId}`)
  }
  render() {
    const { actions, assigned } = this.props
    return (
      <Content>
        <ContentColumn>
          <ColumnSection title="Available actions">
            {actions.map(action => (
              <ExpandableBoxWrapper key={action.title}>
                <ExpandableBox title={action.title} summary={action.summary}>
                  <ActionDetails>
                    <section>
                      <h1>
                        <Text
                          color={theme.textSecondary}
                          weight="bold"
                          smallcaps
                        >
                          Can be performed by:
                        </Text>
                      </h1>
                      <ul>
                        {action.canPerform.map(([app, instance]) => (
                          <li key={app + instance}>
                            <span>{app}</span>
                            {instance && <Badge aspect="app">{instance}</Badge>}
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h1>
                        <Text
                          color={theme.textSecondary}
                          weight="bold"
                          smallcaps
                        >
                          Revokable by:
                        </Text>
                      </h1>
                      <ul>
                        {action.canRevoke.map(([app, instance]) => (
                          <li key={app + instance}>
                            {app}
                            {instance}
                          </li>
                        ))}
                      </ul>
                    </section>
                  </ActionDetails>
                </ExpandableBox>
              </ExpandableBoxWrapper>
            ))}
          </ColumnSection>
        </ContentColumn>
        <ContentColumn>
          <ColumnSection title="Assigned permissions">
            {assigned.map(permission => (
              <ExpandableBoxWrapper key={permission.title}>
                <ExpandableBox
                  title={permission.title}
                  summary={permission.summary}
                  summaryFooter={
                    <RevokeFooter
                      permissionId={permission.title}
                      revokableBy={permission.canRevoke}
                      onRevoke={this.handleRevoke}
                    />
                  }
                >
                  <ActionDetails />
                </ExpandableBox>
              </ExpandableBoxWrapper>
            ))}
          </ColumnSection>
        </ContentColumn>
      </Content>
    )
  }
}

const ContentColumn = styled.div`
  width: 50%;
  & + & {
    margin-left: 30px;
  }
`

const Content = styled.div`
  display: flex;
  width: 100%;
  min-width: 600px;
  padding: 40px;
`

const ExpandableBoxWrapper = styled.div`
  margin-bottom: 20px;
`

const ActionDetails = styled.div`
  display: flex;
  section {
    width: 50%;
  }
  li {
    list-style: none;
    margin-top: 10px;
  }
  li > span:first-child {
    margin-right: 10px;
  }
`

export default InstancePermissions
