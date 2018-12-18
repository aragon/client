import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { theme } from '@aragon/ui'
import OrganizationItem from './OrganizationItem'
import { FavoriteDaoType } from '../../../prop-types'
import FocusVisible from '../../FocusVisible'

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
        <FocusVisible>
          {({ focusVisible, onFocus }) => (
            <React.Fragment>
              <OrganizationButton
                onClick={this.handleOpenClick}
                focusVisible={focusVisible}
                onFocus={onFocus}
              >
                <OrganizationItem dao={dao} />
              </OrganizationButton>
              <FavoriteButton
                onClick={this.handleFavoriteClick}
                focusVisible={focusVisible}
                onFocus={onFocus}
              >
                {dao.favorited ? '★' : '☆'}
              </FavoriteButton>
            </React.Fragment>
          )}
        </FocusVisible>
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
    outline: ${p => (p.focusVisible ? `2px solid ${theme.accent}` : '0')};
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
    outline: ${p => (p.focusVisible ? `2px solid ${theme.accent}` : '0')};
  }
  &::-moz-focus-inner {
    border: 0;
  }
`

export default FavoriteRow
