import React from 'react'
import { SidePanel, DropDown, Info, Field, Button } from '@aragon/ui'
import { PermissionsConsumer } from '../../contexts/PermissionsContext'

class PermissionPanel extends React.PureComponent {
  render() {
    const { permission, onClose, opened } = this.props
    const mode = permission === true ? 'add' : 'edit'

    return (
      <SidePanel
        title={mode === 'add' ? 'Add permission' : 'Modify permission'}
        opened={opened}
        onClose={onClose}
      >
        <PermissionsConsumer>
          {({ permissions }) => {
            return (
              permission && (
                <React.Fragment>
                  <Field label="Action">
                    {mode === 'add' ? (
                      <DropDown items={['Assign tokens']} wide />
                    ) : (
                      <p style={{ marginTop: '10px' }}>
                        {permission.actionName}
                      </p>
                    )}
                  </Field>
                  <Field label="Allowed for">
                    <DropDown items={['Voting']} wide />
                  </Field>
                  <Field label="Editable by">
                    <DropDown items={['Voting']} wide />
                  </Field>

                  <Field>
                    <Button mode="strong" wide onClick={onClose}>
                      {mode === 'add' ? 'Add permission' : 'Modify permission'}
                    </Button>
                  </Field>

                  {mode === 'add' ? (
                    <AddPermissionInfo />
                  ) : (
                    <EditPermissionInfo />
                  )}
                </React.Fragment>
              )
            )
          }}
        </PermissionsConsumer>
      </SidePanel>
    )
  }
}

const AddPermissionInfo = () => (
  <Info.Action title="Adding the permission will create a vote">
    Since the permission can be created by Voting, it will automatically
    generate a new vote.
  </Info.Action>
)

const EditPermissionInfo = () => (
  <Info.Action title="Modifying the permission will create a vote">
    Since the permission is editable by Voting, modifying it will automatically
    generate a new vote.
  </Info.Action>
)

export default PermissionPanel
