import React from 'react'
import styled from 'styled-components'
import { Table, TableHeader, TableRow, TableCell, Button } from '@aragon/ui'
import Section from '../Section'

class PermissionsList extends React.PureComponent {
  render() {
    const { permissions, onEdit } = this.props

    const activePermissions = permissions.filter(action => !action.pending)
    const pendingPermissions = permissions.filter(action => action.pending)

    return (
      <div>
        {[
          { title: 'Permissions', group: activePermissions },
          { title: 'Pending permissions', group: pendingPermissions },
        ].map(({ title, group }) => (
          <Section title={title} key={title}>
            <Table
              header={
                <TableRow>
                  <TableHeader title="Action" />
                  <TableHeader title="Allowed for" />
                  <TableHeader title="Editable by" />
                  <TableHeader title="Parameters" />
                  <TableHeader title="Constraints" />
                  <TableHeader />
                </TableRow>
              }
            >
              {group.map((action, i) => (
                <Row key={i} {...action} onEdit={onEdit} />
              ))}
            </Table>
          </Section>
        ))}
      </div>
    )
  }
}

class Row extends React.PureComponent {
  handleEdit = () => {
    this.props.onEdit(this.props.permissionId)
  }
  render() {
    const {
      actionName,
      allowedFor,
      editableBy,
      parameters,
      constraints,
      pending,
    } = this.props
    return (
      <TableRow>
        <TableCell>{actionName}</TableCell>
        <TableCell>{allowedFor}</TableCell>
        <TableCell>{editableBy}</TableCell>
        <TableCell>{parameters}</TableCell>
        <TableCell>{constraints ? 'View' : 'None'}</TableCell>
        <TableCell>
          {pending ? (
            'Pending vote'
          ) : (
            <ModifyButton onClick={this.handleEdit} />
          )}
        </TableCell>
      </TableRow>
    )
  }
}

const ModifyButton = styled(Button).attrs({ mode: 'text', children: 'Modify' })`
  text-decoration: underline;
`

export default PermissionsList
