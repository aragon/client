import React from 'react'
import { styled, theme, Text } from '@aragon/ui'
import ColumnSection from '../ColumnSection/ColumnSection'
import ExpandableBox from '../ExpandableBox/ExpandableBox'
import Badge from '../Badge/Badge'

const InstancePermissions = ({
  actions,
  assigned,
  instance: { appId, instanceId },
}) => (
  <Content>
    <ContentColumn>
      <ColumnSection title="Available actions">
        {actions.map(action => (
          <ExpandableBoxWrapper key={action.title}>
            <ExpandableBox title={action.title} summary={action.summary}>
              <ActionDetails>
                <section>
                  <h1>
                    <Text color={theme.textSecondary} weight="bold" smallcaps>
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
                    <Text color={theme.textSecondary} weight="bold" smallcaps>
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
              topFooter={
                <RevokeFooter>
                  <p>
                    <em>Revokable by {permission.canRevoke}</em>
                  </p>
                  <p>
                    <a>Revoke</a>
                  </p>
                </RevokeFooter>
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

const RevokeFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  color: ${theme.textTertiary};
  a {
    text-decoration: underline;
  }
`

const ActionDetails = styled.div`
  display: flex;
  h1 {
    padding-left: ${({ shiftTitle }) => (shiftTitle ? '20px' : '0')};
    padding-bottom: 5px;
  }
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
