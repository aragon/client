import React from 'react'
import { styled, Button, Field, DropDown } from '@aragon/ui'

class AssignPermission extends React.Component {
  state = {
    entitiesIndex: 0,
    callsIndex: 0,
    actionsIndex: 0,
  }
  updateValue(name, value) {
    this.setState({ [name]: value })
  }
  render() {
    const { entities, calls, actions, onDone } = this.props
    const { entitiesIndex, callsIndex, actionsIndex } = this.state
    return (
      <div>
        <Field label="Give permission to">
          <DropDown
            items={entities}
            active={entitiesIndex}
            onChange={index => this.updateValue('entitiesIndex', index)}
            wide
          />
        </Field>

        <Field label="To call">
          <DropDown
            items={calls}
            active={callsIndex}
            onChange={index => this.updateValue('callsIndex', index)}
            wide
          />
        </Field>

        <Field label="With action">
          <DropDown
            items={actions}
            active={actionsIndex}
            onChange={index => this.updateValue('actionsIndex', index)}
            wide
          />
        </Field>

        <ButtonRow>
          <Button onClick={onDone} mode="strong" wide>
            Assign permission
          </Button>
        </ButtonRow>
      </div>
    )
  }
}

const ButtonRow = styled.div`
  padding-top: 10px;
`

export default AssignPermission
