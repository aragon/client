import React from 'react'
import PropTypes from 'prop-types'
import { Viewport } from '@aragon/ui'
import { RepoType } from '../../../prop-types'
import { ZoomableCards } from '../../../components/ZoomableCards'

import AppsGrid from './AppsGrid'
import AppContent from './AppContent'
import AppCardContent from './AppCardContent'
import RepoVersions from './RepoVersions'

class InstalledApps extends React.Component {
  static propTypes = {
    repos: PropTypes.arrayOf(RepoType).isRequired,
    openedRepoId: PropTypes.string,
    onOpenApp: PropTypes.func.isRequired,
    onRequestUpgrade: PropTypes.func.isRequired,
  }
  static defaultProps = {
    openedRepoId: null,
  }
  getOpenedRepoByAppId(appId) {
    return this.props.repos.find(repo => repo.appId === appId)
  }
  render() {
    const { repos, openedRepoId, onOpenApp, onRequestUpgrade } = this.props
    return (
      <Viewport>
        {({ above, below }) => (
          <ZoomableCards
            currentId={openedRepoId}
            renderCards={({ card }) => (
              <AppsGrid>
                {repos.map(repo =>
                  card(
                    repo.appId,
                    <AppCardContent repo={repo} onOpen={onOpenApp} />
                  )
                )}
              </AppsGrid>
            )}
            renderOpenedCard={({ currentId }) => {
              const openedRepo = this.getOpenedRepoByAppId(currentId)
              return (
                <AppContent
                  repo={openedRepo}
                  repoVersions={
                    below('large') && <RepoVersions repo={openedRepo} />
                  }
                  onRequestUpgrade={onRequestUpgrade}
                />
              )
            }}
            renderOpenedAside={
              above('large') &&
              (({ currentId }) => (
                <RepoVersions repo={this.getOpenedRepoByAppId(currentId)} />
              ))
            }
          />
        )}
      </Viewport>
    )
  }
}

export default InstalledApps
