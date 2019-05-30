import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, Text, theme } from '@aragon/ui'
import { ModalWrapper, DisplayErrors } from './ModalWrapper'
import { ModalContext } from '../../wrappers/modal'
import { close } from '../../stateManagers/modal'

const RemoveItem = ({ itemType, onRemove, removingError }) => {
  const { dispatchModal } = useContext(ModalContext)
  let title
  if (itemType === 'workHistory') title = 'Delete work history record'
  else if (itemType === 'educationHistory')
    title = 'Delete education history record'
  else title = 'Delete data'

  return (
    <ModalWrapper title={title}>
      <DisplayErrors errors={removingError} />
      <Text size="large" style={{ margin: '20px 0 26px 0' }}>
        Are you sure you want to delete it?
      </Text>
      <ButtonsRow>
        <Button compact mode="outline" onClick={() => dispatchModal(close())}>
          Cancel
        </Button>
        <Button
          compact
          mode="strong"
          style={{ background: theme.negative }}
          onClick={onRemove}
        >
          Delete
        </Button>
      </ButtonsRow>
    </ModalWrapper>
  )
}

const ButtonsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  > * {
    margin-left: 13px;
    width: 130px;
  }
`

RemoveItem.propTypes = {
  onRemove: PropTypes.func.isRequired,
  itemType: PropTypes.string.isRequired,
  removingError: PropTypes.object,
}

export default RemoveItem
