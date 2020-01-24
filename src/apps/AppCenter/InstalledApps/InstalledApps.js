import React from 'react'
import PropTypes from 'prop-types'
import { useLayout, CardLayout, GU, Tag } from '@aragon/ui'
import { RepoType } from '../../../prop-types'
import AppContent from './AppContent'
import AppCard from '../AppCard'
import RepoVersions from './RepoVersions'
import AppIcon from '../../../components/AppIcon/AppIcon'

const InstalledApps = React.memo(function InstalledApps({
  repos,
  openedRepoId,
  onOpenApp,
  onRequestUpgrade,
  onCloseRepo,
}) {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  const rowHeight = compactMode ? 148 : 294
  const columnWidthMin = compactMode ? 328 : 30 * GU

  if (openedRepoId) {
    const openedRepo = repos.find(repo => repo.appId === openedRepoId)
    return (
      <AppContent
        repo={openedRepo}
        repoVersions={<RepoVersions repo={openedRepo} />}
        onRequestUpgrade={onRequestUpgrade}
        onClose={onCloseRepo}
      />
    )
  }

  return (
    <CardLayout columnWidthMin={columnWidthMin} rowHeight={rowHeight}>
      {repos.map(repo => {
        const {
          repoName,
          appId,
          name,
          baseUrl,
          currentVersion,
          latestVersion,
        } = repo
        const { description, icons } = latestVersion.content
        const canUpgrade =
          Boolean(currentVersion) &&
          currentVersion.version !== latestVersion.version
        const handleClick = () => onOpenApp(repoName)

        return (
          <AppCard
            key={appId}
            onClick={handleClick}
            icon={
              <AppIcon app={{ baseUrl, icons }} size={9 * GU} radius={12} />
            }
            name={name}
            tag={
              <Tag mode={canUpgrade ? 'new' : 'indicator'}>
                {canUpgrade ? 'New version' : 'Up to date'}
              </Tag>
            }
            description={description}
          />
        )
      })}
    </CardLayout>
  )
})

InstalledApps.propTypes = {
  repos: PropTypes.arrayOf(RepoType).isRequired,
  openedRepoId: PropTypes.string,
  onCloseRepo: PropTypes.func.isRequired,
  onOpenApp: PropTypes.func.isRequired,
  onRequestUpgrade: PropTypes.func.isRequired,
}

InstalledApps.defaultProps = {
  openedRepoId: null,
}

export default InstalledApps
