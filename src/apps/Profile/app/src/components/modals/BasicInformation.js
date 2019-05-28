import React, { useState } from 'react'
import { Button, TextInput } from '@aragon/ui'
import PropTypes from 'prop-types'
import { ModalWrapper, TwoColumnsRow, DisplayErrors } from './ModalWrapper'
import { Label, TextInputWithValidation } from '../styled-components'
import { validateName, validateWebsite } from '../../utils/validation'

const BasicInformation = ({
  ethereumAddress,
  getFormValue,
  onChange,
  saveProfile,
  savingError,
}) => {
  const [validationErrors, setValidationErrors] = useState({})

  const validateAndSave = () => {
    const errors = {}
    if (!validateName(getFormValue('name')))
      errors['name'] = 'Please provide valid name'

    // validate only if non-empty
    const website = getFormValue('website')
    if (!!website && !validateWebsite(website))
      errors['website'] = 'Please provide valid website address'

    setValidationErrors(errors)
    if (!Object.keys(errors).length) saveProfile(ethereumAddress)
  }

  return (
    <ModalWrapper title="Edit Basic Information">
      <DisplayErrors errors={{ ...validationErrors, ...savingError }} />
      <TwoColumnsRow>
        <div>
          <Label>Name</Label>
          <TextInputWithValidation
            wide
            onChange={e => onChange(e.target.value, 'name')}
            value={getFormValue('name')}
            error={validationErrors['name']}
          />
        </div>
        <div>
          <Label>Location</Label>
          <TextInput
            wide
            onChange={e => onChange(e.target.value, 'location')}
            value={getFormValue('location')}
          />
        </div>
      </TwoColumnsRow>

      <div>
        <Label>Bio</Label>
        <TextInput.Multiline
          style={{ height: '80px' }}
          wide
          value={getFormValue('description')}
          onChange={e => onChange(e.target.value, 'description')}
        />
      </div>
      <div>
        <Label>Website</Label>
        <TextInputWithValidation
          wide
          value={getFormValue('website')}
          onChange={e => onChange(e.target.value, 'website')}
          type="url"
          error={validationErrors['website']}
        />
      </div>

      <Button mode="strong" wide onClick={validateAndSave}>
        Save
      </Button>
    </ModalWrapper>
  )
}

BasicInformation.propTypes = {
  ethereumAddress: PropTypes.string.isRequired,
  getFormValue: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  saveProfile: PropTypes.func.isRequired,
}

export default BasicInformation
