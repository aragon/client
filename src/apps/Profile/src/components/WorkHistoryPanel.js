import React, { useContext } from 'react'
import CardWrapper from '../wrappers/styleWrappers/CardWrapper'
import { useProfile } from '../hooks'
import { ModalContext } from '../wrappers/modal'
import WorkHistoryTile from './WorkHistoryTile'
import { open, removeItem } from '../stateManagers/modal'
import { Text, theme } from '@aragon/ui'
import styled from 'styled-components'

const WorkHistoryPanel = () => {
  const { workHistory, viewMode } = useProfile()
  const { dispatchModal } = useContext(ModalContext)

  const historyNotEmpty = Object.keys(workHistory).length > 0

  const cardProps = {
    title: 'Work history',
    addMore: historyNotEmpty ? () => dispatchModal(open('workHistory')) : null,
    addSeparators: true,
    viewMode,
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
          {!viewMode && (
            <Text
              style={{ cursor: 'pointer' }}
              size="small"
              color={theme.accent}
              onClick={() => dispatchModal(open('workHistory'))}
            >
              Add work
            </Text>
          )}
        </Center>
      )}
    </CardWrapper>
  )
}

const Center = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90px;
`

export default WorkHistoryPanel
