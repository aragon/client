import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Text, theme } from '@aragon/ui'
import { IconPencil, IconTrash } from '../assets'
import { displayStartEndDates } from '../utils'

const EducationHistoryTile = ({
  educationHistoryData,
  openModal,
  removeItem,
}) => (
  <SingleEducationItem>
    <div>
      <Text.Block size="large">{educationHistoryData.organization}</Text.Block>
      <Text.Block size="normal">
        {educationHistoryData.degree}
        {educationHistoryData.fieldOfStudy
          ? ', ' + educationHistoryData.fieldOfStudy
          : ''}
      </Text.Block>
      <Dates>{displayStartEndDates(educationHistoryData)}</Dates>
    </div>
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
    margin-bottom: 3px;
  }
`
const Icons = styled.div`
  display: inline-flex;
  width: auto;
  flex-direction: column;
  visibility: hidden;
  > * {
    margin: 0 0 8px 8px;
    cursor: pointer;
  }
  ${SingleEducationItem}:hover & {
    visibility: visible;
  }
`

const Dates = styled(Text.Block).attrs({ size: 'small' })`
  color: ${theme.textTertiary};
  margin-top: 2px;
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
