import React from 'react'
import PropTypes from 'prop-types'
import OrganizationItem from './OrganizationItem'
import { FavoriteDaoType } from '../../../prop-types'
import ItemButton from './ItemButton'

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
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <ItemButton
          css={`
            display: flex;
            flex-grow: 1;
          `}
          onClick={this.handleOpenClick}
        >
          <OrganizationItem dao={dao} />
        </ItemButton>
        <ItemButton
          css={`
            padding: 0 10px;
            color: hsl(50, 90%, 50%);
          `}
          onClick={this.handleFavoriteClick}
        >
          {dao.favorited ? '★' : '☆'}
        </ItemButton>
      </div>
    )
  }
}

export default FavoriteRow
