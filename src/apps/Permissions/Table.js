import { TableHeader, TableCell, breakpoint } from '@aragon/ui'
import styled from 'styled-components'

const StyledTableHeader = styled(TableHeader)`
  padding-left: 0;
  text-align: center;

  ${breakpoint(
    'medium',
    `
      padding-left: 21px;
      text-align: unset;
    `
  )}
`

const StyledTableCell = styled(TableCell)`
  padding: 20px 10px;
  width: 33.333333%;

  > div {
    display: block;
    max-width: 33.333333vw;
    text-align: center;
  }

  ${breakpoint(
    'medium',
    `
      width: auto;
      padding: 20px;

      > div {
        display: inline-flex;
        max-width: unset;
        text-align: unset;
      }
    `
  )}
`

const FirstTableCell = styled(StyledTableCell)`
  &&& {
    border-left-width: 0;
    border-right-width: 0;
    :first-child {
      border-radius: 0;
    }
  }

  > div {
    text-align: left;
  }

  ${breakpoint(
    'medium',
    `
      &&& {
        border-left-width: 1px;
        border-right-width: 1px;
         :first-child {
          border-radius: 3px;
        }
      }
    `
  )};
`

const LastTableCell = styled(StyledTableCell)`
  &&& {
    border-left-width: 0;
    border-right-width: 0;
    :last-child {
      border-radius: 0;
    }
  }

  > div {
    text-align: right;
  }

  ${breakpoint(
    'medium',
    `
      &&& {
        border-left-width: 1px;
        border-right-width: 1px;
         :last-child {
          border-radius: 3px;
        }
      }
    `
  )};
`

export {
  StyledTableHeader as TableHeader,
  StyledTableCell as TableCell,
  FirstTableCell,
  LastTableCell,
}
