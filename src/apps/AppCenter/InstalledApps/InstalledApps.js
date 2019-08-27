import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useLayout, Card, CardLayout, GU } from '@aragon/ui'
import { RepoType } from '../../../prop-types'
import AppContent from './AppContent'
import AppCardContent from './AppCardContent'
import RepoVersions from './RepoVersions'

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
      {repos.map(repo => (
        <AppCard
          repo={repo}
          onOpenApp={onOpenApp}
          key={repo.appId}
          compactMode={compactMode}
        />
      ))}
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

const AppCard = React.memo(function AppCard({ repo, onOpenApp, compactMode }) {
  const { repoName } = repo
  const handleOpenApp = useCallback(() => {
    onOpenApp(repoName)
  }, [onOpenApp, repoName])

  return (
    <Card onClick={handleOpenApp} css="display: block;">
      <AppCardContent repo={repo} compactMode={compactMode} />
    </Card>
  )
})

AppCard.propTypes = {
  repo: RepoType.isRequired,
  onOpenApp: PropTypes.func.isRequired,
}

export default InstalledApps
