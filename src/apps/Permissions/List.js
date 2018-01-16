import React from 'react'
import { styled, theme } from '@aragon/ui'
import ListItem from './ListItem'
import ColumnSection from '../../components/ColumnSection/ColumnSection'

const List = ({ title, items, onClick }) => (
  <ColumnSection title={title} shiftTitle>
    <StyledList clickable={Boolean(onClick)}>
      {items.map(({ id, label, badge }) => (
        <ListItem
          key={id}
          id={id}
          label={label}
          badge={badge}
          onClick={onClick}
        />
      ))}
    </StyledList>
  </ColumnSection>
)

const StyledList = styled.ul`
  list-style: none;
  background: ${theme.contentBackground};
  border: 1px solid ${theme.contentBorder};
  border-radius: 4px;
  li {
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 19px;
    border-top: 1px solid ${theme.contentBorder};
    cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  }
  li:first-child {
    border-top: 0;
  }
`

export default List
