import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { theme } from '@aragon/ui'
import OrganizationItem from './OrganizationItem'
import { FavoriteDaoType } from '../../../prop-types'

class FavoriteRow extends React.Component {
  static propTypes = {
    dao: FavoriteDaoType.isRequired,
    onOpen: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }
  handleOpenClick = () => {
    const { dao } = this.props
    this.props.onOpen(dao)
  }
  handleFavoriteClick = () => {
    const { dao } = this.props
    this.props.onUpdate(dao, !dao.favorited)
  }
  render() {
    const { dao } = this.props
    return (
      <Main>
        <OrganizationButton onClick={this.handleOpenClick}>
          <OrganizationItem dao={dao} />
        </OrganizationButton>
        <FavoriteButton onClick={this.handleFavoriteClick}>
          {dao.favorited ? '★' : '☆'}
        </FavoriteButton>
      </Main>
    )
  }
}

const Main = styled.div`
  display: flex;
  align-items: center;
`

const OrganizationButton = styled.button.attrs({ type: 'button' })`
  flex-grow: 1;
  border: 0;
  background: none;
  cursor: pointer;
  padding: 0;
  &:active {
    background: rgba(220, 234, 239, 0.3);
  }
  &:focus {
    outline: 2px solid ${theme.accent};
  }
  &:focus:not(:focus-visible) {
    outline: 0;
  }
  &:focus-visible {
    outline: 2px solid ${theme.accent};
  }
  &:active {
    outline: 0;
    background: rgba(220, 234, 239, 0.3);
  }
  &::-moz-focus-inner {
    border: 0;
  }
`

const FavoriteButton = styled.button.attrs({ type: 'button' })`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: 44px;
  padding: 0 10px;
  white-space: nowrap;
  cursor: pointer;
  border: 0;
  color: hsl(50, 90%, 50%);
  background: transparent;
  &:active {
    background: rgba(220, 234, 239, 0.3);
  }
  &:focus {
    outline: 2px solid ${theme.accent};
  }
  &:focus:not(:focus-visible) {
    outline: 0;
  }
  &:focus-visible {
    outline: 2px solid ${theme.accent};
  }
  &::-moz-focus-inner {
    border: 0;
  }
`

export default FavoriteRow
