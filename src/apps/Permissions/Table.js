import { TableHeader, TableCell, breakpoint } from '@aragon/ui'
import styled from 'styled-components'

const StyledTableHeader = styled(TableHeader)`
  padding-left: 0;
  text-align: center;

  ${breakpoint(
    'medium',
    `
      padding-left: 20px;
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
  > div {
    text-align: left;
  }
`

const LastTableCell = styled(StyledTableCell)`
  > div {
    text-align: right;
  }
`

export {
  StyledTableHeader as TableHeader,
  StyledTableCell as TableCell,
  FirstTableCell,
  LastTableCell,
}
