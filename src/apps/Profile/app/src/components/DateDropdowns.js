import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Checkbox } from '@aragon/ui'
import { Label, DropDownWithValidation } from './styled-components'
import { years, months } from '../utils'

const DateDropdowns = ({
  current,
  dispatchDateChange,
  indexStartMonth,
  indexStartYear,
  indexEndMonth,
  indexEndYear,
  type,
  error,
}) => (
  <Fragment>
    <Label style={{ margin: 0 }}>Start Date</Label>
    <DateDropDowns>
      <div style={{ width: '48%' }}>
        <DropDownWithValidation
          wide
          items={months}
          active={indexStartMonth}
          onChange={index =>
            dispatchDateChange({ type: 'setIndexStartMonth', index })
          }
          error={error}
        />
      </div>
      <div style={{ width: '48%' }}>
        <DropDownWithValidation
          wide
          items={years}
          active={indexStartYear}
          onChange={index =>
            dispatchDateChange({ type: 'setIndexStartYear', index })
          }
          error={error}
        />
      </div>
    </DateDropDowns>

    <Label style={{ margin: 0 }}>End Date</Label>
    <div style={{ display: 'flex', height: '40px' }}>
      {!current && (
        <DateDropDowns>
          <div style={{ width: '48%' }}>
            <DropDownWithValidation
              wide
              items={months}
              active={indexEndMonth}
              onChange={index =>
                dispatchDateChange({ type: 'setIndexEndMonth', index })
              }
              error={error}
            />
          </div>
          <div style={{ width: '48%' }}>
            <DropDownWithValidation
              wide
              items={years}
              active={indexEndYear}
              onChange={index =>
                dispatchDateChange({ type: 'setIndexEndYear', index })
              }
              error={error}
            />
          </div>
        </DateDropDowns>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={current}
          onChange={index => dispatchDateChange({ type: 'setCurrent', index })}
        />
        {type === 'workHistory'
          ? 'I currently work here'
          : 'I currently study here'}
      </div>
    </div>
  </Fragment>
)

const DateDropDowns = styled.div`
  width: 60%;
  padding-right: 1rem;
  display: flex;
  justify-content: space-between;
`

export default DateDropdowns
