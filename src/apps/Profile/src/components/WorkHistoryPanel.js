import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import CardWrapper from '../wrappers/styleWrappers/CardWrapper'
import { BoxContext } from '../wrappers/box'
import { ModalContext } from '../wrappers/modal'
import WorkHistoryTile from './WorkHistoryTile'
import { open, removeItem } from '../stateManagers/modal'
import { Text, theme } from '@aragon/ui'
import styled from 'styled-components'

const WorkHistoryPanel = ({ ethereumAddress }) => {
  const { boxes } = useContext(BoxContext)
  const { dispatchModal } = useContext(ModalContext)

  const userLoaded = !!boxes[ethereumAddress]

  const workHistory = userLoaded
    ? boxes[ethereumAddress].publicProfile.workHistory || {}
    : {}

  const historyNotEmpty = Object.keys(workHistory).length > 0

  const cardProps = {
    title: 'Work history',
    addMore: historyNotEmpty ? () => dispatchModal(open('workHistory')) : null,
    addSeparators: true,
  }

  return (
    <CardWrapper {...cardProps}>
      {historyNotEmpty ? (
        Object.keys(workHistory).map(id => (
          <WorkHistoryTile
            key={id}
            workHistoryData={workHistory[id]}
            openModal={() => dispatchModal(open('workHistory', id))}
            removeItem={() => dispatchModal(removeItem(id, 'workHistory'))}
          />
        ))
      ) : (
        <Center>
          <Text size="xlarge">You have no work history</Text>
          <Text
            style={{ cursor: 'pointer' }}
            size="small"
            color={theme.accent}
            onClick={() => dispatchModal(open('workHistory'))}
          >
            Add work
          </Text>
        </Center>
      )}
    </CardWrapper>
  )
}

WorkHistoryPanel.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
}

const Center = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 7rem;
`

export default WorkHistoryPanel
