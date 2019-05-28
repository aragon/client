import React, { useState } from 'react'
import { Button } from '@aragon/ui'
import PropTypes from 'prop-types'
import { ModalWrapper, TwoColumnsRow, DisplayErrors } from './ModalWrapper'
import { useDate } from '../../hooks'
import { years } from '../../utils'
import DateDropdowns from '../DateDropdowns'
import {
  Label,
  TextInputWithValidation,
  TextMultilineWithValidation,
} from '../styled-components'
import {
  validateWorkPlace,
  validateJobTitle,
  validateWorkDates,
  workDatesError,
} from '../../utils/validation'

const WorkHistory = ({
  getFormValue,
  onChange,
  workHistoryId,
  ethereumAddress,
  saveProfile,
  savingError,
}) => {
  const [validationErrors, setValidationErrors] = useState({})

  const validateAndSave = () => {
    const errors = {}
    if (
      !validateWorkPlace(
        getFormValue('workHistory', workHistoryId, 'workPlace')
      )
    )
      errors['workPlace'] = 'Please provide name of company or project'

    if (
      !validateJobTitle(getFormValue('workHistory', workHistoryId, 'jobTitle'))
    )
      errors['jobTitle'] = 'Please provide job title or role'

    if (!validateWorkDates(startDate, endDate))
      errors['dates'] = workDatesError(startDate, endDate)

    setValidationErrors(errors)
    if (!Object.keys(errors).length) saveProfile(ethereumAddress)
  }

  const startDate = getFormValue('workHistory', workHistoryId, 'startDate')
  const endDate = getFormValue('workHistory', workHistoryId, 'endDate')

  const {
    indexStartYear,
    indexStartMonth,
    indexEndYear,
    indexEndMonth,
    current,
    dispatchDateChange,
  } = useDate(startDate, endDate, years, onChange, 'workHistory', workHistoryId)

  return (
    <ModalWrapper title="Add Work">
      <DisplayErrors errors={{ ...validationErrors, ...savingError }} />
      <TwoColumnsRow>
        <div>
          <Label>Company or Project</Label>
          <TextInputWithValidation
            wide
            value={getFormValue('workHistory', workHistoryId, 'workPlace')}
            onChange={e =>
              onChange(
                e.target.value,
                'workHistory',
                workHistoryId,
                'workPlace'
              )
            }
            error={validationErrors['workPlace']}
          />
        </div>
        <div>
          <Label>Job Title or Role</Label>
          <TextInputWithValidation
            wide
            value={getFormValue('workHistory', workHistoryId, 'jobTitle')}
            onChange={e =>
              onChange(e.target.value, 'workHistory', workHistoryId, 'jobTitle')
            }
            error={validationErrors['jobTitle']}
          />
        </div>
      </TwoColumnsRow>

      <div>
        <Label>Description</Label>
        <TextMultilineWithValidation
          style={{ height: '80px' }}
          wide
          value={getFormValue('workHistory', workHistoryId, 'description')}
          onChange={e =>
            onChange(
              e.target.value,
              'workHistory',
              workHistoryId,
              'description'
            )
          }
          error={validationErrors['description']}
        />
      </div>

      <DateDropdowns
        current={current}
        dispatchDateChange={dispatchDateChange}
        indexStartMonth={indexStartMonth}
        indexStartYear={indexStartYear}
        indexEndMonth={indexEndMonth}
        indexEndYear={indexEndYear}
        type="workHistory"
        error={validationErrors['dates']}
      />

      <Button wide mode="strong" onClick={validateAndSave}>
        Save
      </Button>
    </ModalWrapper>
  )
}

WorkHistory.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
  getFormValue: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  saveProfile: PropTypes.func.isRequired,
  workHistoryId: PropTypes.string.isRequired,
}

export default WorkHistory
