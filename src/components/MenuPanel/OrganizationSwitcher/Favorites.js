import React from 'react'
import PropTypes from 'prop-types'
import { IconPlus, GU, RADIUS, useTheme } from '@aragon/ui'
import { getKnownOrganization } from '../../../known-organizations'
import { FavoriteDaoType, DaoItemType } from '../../../prop-types'
import { addressesEqual } from '../../../util/web3'
import FavoritesMenu from '../../FavoritesMenu/FavoritesMenu'
import FavoritesMenuItemButton from '../../FavoritesMenu/FavoritesMenuItemButton'
import OrgIcon from '../../OrgIcon/OrgIcon'
import { useWallet } from '../../../contexts/wallet'
import { favoriteToggleEvent } from '../../../contexts/FavoriteDaosContext'

class Favorites extends React.Component {
  static propTypes = {
    favoriteDaos: PropTypes.arrayOf(FavoriteDaoType),
    currentDao: DaoItemType,
    onUpdate: PropTypes.func.isRequired,
    theme: PropTypes.object,
    networkType: PropTypes.string.isRequired,
  }

  state = { localDaos: [] }

  componentDidMount() {
    this.setState({ localDaos: this.getLocalDaos() })
  }

  componentWillUnmount() {
    const { onUpdate } = this.props
    const { localDaos } = this.state
    onUpdate(
      localDaos
        .filter(dao => dao.favorited)
        .map(dao => ({
          name: dao.name,
          address: dao.address,
        }))
    )
  }

  // Build the local DAO list based on the favorites. The favorite state is not
  // directly reflected in the popup, to let users favorite / unfavorite items
  // without seeing them being immediately removed. For this reason, we need to
  // maintain a separate state.
  getLocalDaos() {
    const { currentDao, favoriteDaos } = this.props

    const localDaos = [
      ...favoriteDaos
        .map(dao => ({ ...dao, favorited: true }))
        .sort(dao =>
          addressesEqual(dao.address, currentDao.address) ? -1 : 0
        ),
    ]

    // If the current DAO is favorited, it is already in the local list
    return this.isDaoFavorited(currentDao)
      ? localDaos
      : [{ ...currentDao, favorited: false }, ...localDaos]
  }

  isDaoFavorited({ address }) {
    return this.props.favoriteDaos.some(dao =>
      addressesEqual(dao.address, address)
    )
  }

  currentDaoWithFavoriteState() {
    const { currentDao } = this.props
    const { localDaos } = this.state
    const daoItem = localDaos.find(dao =>
      addressesEqual(currentDao.address, dao.address)
    )
    return {
      ...currentDao,
      favorited: daoItem ? daoItem.favorited : false,
    }
  }

  handleGoHome = () => {
    window.location.hash = ''
  }

  handleOpenOrg = address => {
    const { currentDao, favoriteDaos } = this.props
    const dao = [currentDao, ...favoriteDaos].find(dao =>
      addressesEqual(dao.address, address)
    )
    window.location.hash = `/${(dao && dao.name) || address}`
  }

  handleFavoriteUpdate = (address, favorited) => {
    const { localDaos } = this.state

    this.setState({
      localDaos: localDaos.map(dao =>
        addressesEqual(dao.address, address) ? { ...dao, favorited } : dao
      ),
    })

    // analytics
    const { networkType } = this.props
    favoriteToggleEvent(
      localDaos.find(dao => addressesEqual(dao.address, address))?.name ||
        address,
      favorited,
      networkType
    )
  }

  render() {
    const { theme, networkType } = this.props
    const { localDaos } = this.state
    const currentDao = this.currentDaoWithFavoriteState()

    const allItems = localDaos.map(org => {
      const knownOrg = getKnownOrganization(networkType, org.address)
      return {
        ...org,
        id: org.address,
        name: knownOrg ? knownOrg.name : org.name || org.address,
        image: <OrgIcon orgAddress={org.address} />,
      }
    })

    const favoriteItems = [...allItems].sort((org, org2) => {
      const { name = '' } = org
      const { name: name2 = '' } = org
      return addressesEqual(org.address, currentDao.address)
        ? -1
        : addressesEqual(org2.address, currentDao.address)
        ? 1
        : name.localeCompare(name2)
    })

    return (
      <section
        aria-label="Organizations"
        css={`
          width: ${42 * GU}px;
        `}
      >
        <FavoritesMenu
          items={favoriteItems}
          onActivate={this.handleOpenOrg}
          onFavoriteUpdate={this.handleFavoriteUpdate}
        />
        <FavoritesMenuItemButton
          onClick={this.handleGoHome}
          css={`
            width: 100%;
            padding: 0 ${2 * GU}px;
            border-top: 1px solid ${theme.border};
          `}
        >
          <span
            css={`
              display: flex;
              align-items: center;
              margin-right: ${1 * GU}px;
              color: ${theme.accentContent};
              background: ${theme.accent};
              border-radius: ${RADIUS}px;
            `}
          >
            <IconPlus />
          </span>
          <span>Open another organization</span>
        </FavoritesMenuItemButton>
      </section>
    )
  }
}

export default props => {
  const theme = useTheme()
  const { networkType } = useWallet()
  return <Favorites networkType={networkType} theme={theme} {...props} />
}
