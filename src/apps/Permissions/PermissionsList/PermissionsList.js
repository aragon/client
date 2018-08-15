import React from 'react'
import styled from 'styled-components'
import { Table, TableHeader, TableRow, TableCell, Button } from '@aragon/ui'
import Section from '../Section'
import { entityRoles } from '../../../permissions'

class PermissionsList extends React.PureComponent {
  render() {
    const {
      apps,
      appsLoading,
      entityAddress,
      permissions,
      onEdit,
      daoAddress,
      resolveEntity,
      resolveRole,
    } = this.props

    if (!permissions || !resolveEntity) {
      return null
    }

    console.log('ABC', entityAddress, resolveEntity(entityAddress, daoAddress))
    console.log(permissions[entityAddress], apps)

    const entity = resolveEntity(entityAddress, daoAddress)
    const roles = entityRoles(
      entityAddress,
      permissions,
      (role, proxyAddress) => ({
        role: resolveRole(proxyAddress, role),
        role2: role,
        appEntity: resolveEntity(proxyAddress, daoAddress),
      })
    )

    console.log('E', entity)
    console.log('R', roles)

    return (
      <div>
        <Section title="Permissions">
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
            {null &&
              permissions.map((action, i) => (
                <Row key={i} {...action} onEdit={onEdit} />
              ))}
          </Table>
        </Section>
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
