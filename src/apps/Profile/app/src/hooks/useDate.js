import { useEffect, useReducer } from 'react'
import { toUnix, yearFromUnix, monthFromUnix, years } from '../utils'

const reducer = (state, { type, index }) => {
  switch (type) {
    case 'setIndexStartYear': {
      return { ...state, indexStartYear: index }
    }
    case 'setIndexStartMonth': {
      return { ...state, indexStartMonth: index }
    }
    case 'setIndexEndYear': {
      return { ...state, indexEndYear: index }
    }
    case 'setIndexEndMonth': {
      return { ...state, indexEndMonth: index }
    }
    case 'setCurrent': {
      return {
        ...state,
        current: !state.current,
        indexEndYear: 0,
        indexEndMonth: 0,
      }
    }
  }
}

const calculateInitialState = (startDate, endDate) => {
  let indexStartYear = 0
  let indexStartMonth = 0
  let indexEndYear = 0
  let indexEndMonth = 0
  let current = false

  if (startDate) {
    const startYear = yearFromUnix(startDate)
    indexStartYear = years.indexOf(startYear)
    indexStartMonth = Number(monthFromUnix(startDate))
  }

  if (endDate) {
    const endYear = yearFromUnix(endDate)
    indexEndYear = years.indexOf(endYear)
    indexEndMonth = Number(monthFromUnix(endDate))
  } else {
    current = true
  }

  return {
    indexStartYear,
    indexStartMonth,
    indexEndYear,
    indexEndMonth,
    current,
  }
}

const useDate = (startDate, endDate, years, onChange, history, id) => {
  const [
    { indexStartYear, indexStartMonth, indexEndYear, indexEndMonth, current },
    dispatchDateChange,
  ] = useReducer(reducer, calculateInitialState(startDate, endDate))

  useEffect(() => {
    if (indexStartYear > 0 && indexStartMonth > 0) {
      const unixTime = toUnix(`${years[indexStartYear]}-${indexStartMonth}-01`)

      if (unixTime !== startDate) onChange(unixTime, history, id, 'startDate')
    } else {
      if (startDate) onChange('', history, id, 'startDate')
    }

    if (indexEndYear > 0 && indexEndMonth > 0) {
      const unixTime = toUnix(`${years[indexEndYear]}-${indexEndMonth}-01`)
      if (unixTime !== endDate) onChange(unixTime, history, id, 'endDate')
    } else {
      if (endDate) onChange('', history, id, 'endDate')
    }

    if (endDate && current) {
      onChange('', history, id, 'endDate')
    }
  }, [
    years,
    startDate,
    onChange,
    id,
    endDate,
    indexStartYear,
    indexStartMonth,
    indexEndYear,
    indexEndMonth,
    history,
    current,
  ])

  return {
    indexStartYear,
    indexStartMonth,
    indexEndYear,
    indexEndMonth,
    current,
    dispatchDateChange,
  }
}

export default useDate
