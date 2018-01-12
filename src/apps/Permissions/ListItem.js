import React from 'react'
import { styled, theme } from '@aragon/ui'
import Badge from '../../components/Badge/Badge'

class ListItem extends React.Component {
  handleClick = () => {
    const { onClick, id } = this.props
    if (onClick) {
      onClick(id)
    }
  }
  render() {
    const { onClick, label, badge } = this.props
    return (
      <Main onClick={onClick ? this.handleClick : undefined}>
        {label}
        {badge && (
          <BadgeWrapper>
            <Badge aspect={badge.style}>{badge.label}</Badge>
          </BadgeWrapper>
        )}
      </Main>
    )
  }
}

const Main = styled.li`
  transition: background 50ms ease-in-out;
  ${({ onClick }) =>
    onClick ? `&:active { background: ${theme.contentBackgroundActive} }` : ''};
`

const BadgeWrapper = styled.span`
  margin-left: 25px;
`

export default ListItem
