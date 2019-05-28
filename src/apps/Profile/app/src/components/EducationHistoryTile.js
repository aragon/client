import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Text, theme } from '@aragon/ui'
import { IconPencil, IconTrash } from '../assets/'
import { displayStartEndDates } from '../utils/'

const EducationHistoryTile = ({
  educationHistoryData,
  openModal,
  removeItem,
}) => (
  <SingleEducationItem>
    <Details>
      <Text.Block size="large" style={{ fontWeight: '700' }}>
        {educationHistoryData.organization}
      </Text.Block>
      <Text.Block size="normal" style={{ fontWeight: '600' }}>
        {educationHistoryData.degree}
        {educationHistoryData.fieldOfStudy
          ? ', ' + educationHistoryData.fieldOfStudy
          : ''}
      </Text.Block>
      <Text.Block size="xsmall" style={{ fontColor: theme.textTertiary }}>
        {displayStartEndDates(educationHistoryData)}
      </Text.Block>
    </Details>
    <Icons>
      <IconPencil
        width="16px"
        color={theme.accent}
        onClick={() => openModal()}
      />
      <IconTrash
        width="16px"
        color={theme.accent}
        onClick={() => removeItem()}
      />
    </Icons>
  </SingleEducationItem>
)
const SingleEducationItem = styled.div`
  display: flex;
  > :not(:last-child) {
    margin-bottom: 0.2rem;
  }
`
const Icons = styled.div`
  display: inline-flex;
  width: auto;
  flex-direction: column;
  visibility: hidden;
  > * {
    margin: 0 0 0.6rem 0.6rem;
    cursor: pointer;
  }
  ${SingleEducationItem}:hover & {
    visibility: visible;
  }
}
`
const Details = styled.div`
  width: 100%;
  > :not(:last-child) {
    margin-bottom: 0.5rem;
  }
`

EducationHistoryTile.propTypes = {
  educationHistoryData: PropTypes.shape({
    degree: PropTypes.string,
    organization: PropTypes.string.isRequired,
    startDate: PropTypes.number,
    endDate: PropTypes.number,
  }).isRequired,
  openModal: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
}

export default EducationHistoryTile
