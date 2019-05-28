import JsonSchemaValidator from 'ajv'
import { isAddress } from 'web3-utils'

export const validator = new JsonSchemaValidator({
  coerceTypes: true,
  useDefaults: true,
})

validator.addFormat('address', {
  type: 'string',
  validate: isAddress,
})

export const validateWorkPlace = validator.compile({
  type: 'string',
  minLength: 1,
  maxLength: 64,
})

export const validateJobTitle = validator.compile({
  type: 'string',
  minLength: 1,
  maxLength: 64,
})

export const validateEducationDates = (startDate, endDate) => {
  if (!startDate && !endDate) return true
  else if (!startDate && endDate) return false
  else if (startDate && !endDate) return true
  else if (startDate > endDate) return false
  else return true
}

export const educationDatesError = (startDate, endDate) => {
  if (!startDate && endDate) return 'Please provide a start date'
  else if (startDate > endDate) return 'Start date must be before end date'
  else return ''
}

export const validateWorkDates = (startDate, endDate) => {
  if (!startDate) return false
  else if (!endDate) return true
  else if (startDate > endDate) return false
  else return true
}

export const workDatesError = (startDate, endDate) => {
  if (!startDate) return 'Please provide a start date'
  else if (!endDate) return 'Please provide an end date'
  else if (startDate > endDate) return 'Start date must be before end date'
  else return ''
}

export const validateEducationOrg = validator.compile({
  type: 'string',
  minLength: 1,
  maxLength: 64,
})

export const validateName = validator.compile({
  type: 'string',
  minLength: 1,
  maxLength: 32,
})

export const validateWebsite = validator.compile({
  type: 'string',
  format: 'uri',
})
