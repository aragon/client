import React, { useContext } from 'react'
import CardWrapper from '../wrappers/styleWrappers/CardWrapper'
import { useProfile } from '../hooks'
import { ModalContext } from '../wrappers/modal'
import EducationHistoryTile from './EducationHistoryTile'
import { open, removeItem } from '../stateManagers/modal'
import { Text, theme } from '@aragon/ui'
import styled from 'styled-components'

const EducationPanel = () => {
  const { educationHistory, viewMode } = useProfile()
  const { dispatchModal } = useContext(ModalContext)

  const historyNotEmpty = Object.keys(educationHistory).length > 0

  const cardProps = {
    title: 'Education',
    addMore: historyNotEmpty
      ? () => dispatchModal(open('educationHistory'))
      : null,
    addSeparators: true,
    viewMode,
  }

  return (
    <CardWrapper {...cardProps}>
      {historyNotEmpty ? (
        Object.keys(educationHistory).map(id => (
          <EducationHistoryTile
            key={id}
            educationHistoryData={educationHistory[id]}
            openModal={() => dispatchModal(open('educationHistory', id))}
            removeItem={() => dispatchModal(removeItem(id, 'educationHistory'))}
          />
        ))
      ) : (
        <Center>
          <Text size="xlarge">You have no education</Text>
          {!viewMode && (
            <Text
              style={{ cursor: 'pointer' }}
              size="small"
              color={theme.accent}
              onClick={() => dispatchModal(open('educationHistory'))}
            >
              Add educaction
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
  height: 7rem;
`

export default EducationPanel
