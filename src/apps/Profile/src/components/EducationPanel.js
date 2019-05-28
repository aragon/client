import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import CardWrapper from '../wrappers/styleWrappers/CardWrapper'
import { BoxContext } from '../wrappers/box'
import { ModalContext } from '../wrappers/modal'
import EducationHistoryTile from './EducationHistoryTile'
import { open, removeItem } from '../stateManagers/modal'
import { Text, theme } from '@aragon/ui'
import styled from 'styled-components'

const EducationPanel = ({ ethereumAddress }) => {
  const { boxes } = useContext(BoxContext)
  const { dispatchModal } = useContext(ModalContext)
  const userLoaded = !!boxes[ethereumAddress]

  const educationHistory = userLoaded
    ? boxes[ethereumAddress].publicProfile.educationHistory || {}
    : {}

  const historyNotEmpty = Object.keys(educationHistory).length > 0

  const cardProps = {
    title: 'Education',
    addMore: historyNotEmpty
      ? () => dispatchModal(open('educationHistory'))
      : null,
    addSeparators: true,
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
          <Text
            style={{ cursor: 'pointer' }}
            size="small"
            color={theme.accent}
            onClick={() => dispatchModal(open('educationHistory'))}
          >
            Add educaction
          </Text>
        </Center>
      )}
    </CardWrapper>
  )
}

EducationPanel.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
}

const Center = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 7rem;
`

export default EducationPanel
