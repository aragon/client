import React from 'react'
import PropTypes from 'prop-types'
import { Viewport } from '@aragon/ui'
import { AppCenterAppType } from '../../../prop-types'
import { ZoomableCards } from '../../../components/ZoomableCards'

import AppsGrid from './AppsGrid'
import AppContent from './AppContent'
import AppVersions from './AppVersions'
import AppCardContent from './AppCardContent'

class InstalledApps extends React.Component {
  static propTypes = {
    apps: PropTypes.arrayOf(AppCenterAppType).isRequired,
    openedAppName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.oneOf([null]),
    ]),
    onOpenApp: PropTypes.func.isRequired,
    onRequestUpgrade: PropTypes.func.isRequired,
  }
  getAppByAppName(appName) {
    return this.props.apps.find(app => app.appName === appName)
  }
  render() {
    const { apps, openedAppName, onOpenApp } = this.props
    return (
      <Viewport>
        {({ above, below }) => (
          <ZoomableCards
            currentId={openedAppName}
            renderCards={({ card }) => (
              <AppsGrid apps={apps}>
                {apps.map(app =>
                  card(
                    app.appName,
                    <AppCardContent app={app} onOpen={onOpenApp} />
                  )
                )}
              </AppsGrid>
            )}
            renderOpenedCard={({ currentId }) => {
              const app = this.getAppByAppName(currentId)
              return (
                <AppContent
                  app={app}
                  appVersions={
                    below('large') && (
                      <AppVersions
                        version={app.version}
                        versions={app.versions}
                      />
                    )
                  }
                  onRequestUpgrade={this.props.onRequestUpgrade}
                />
              )
            }}
            renderOpenedAside={
              above('large') &&
              (({ currentId }) => {
                const app = this.getAppByAppName(currentId)
                return (
                  <AppVersions
                    version={app.version}
                    versions={app.versions}
                    animate
                  />
                )
              })
            }
          />
        )}
      </Viewport>
    )
  }
}

export default InstalledApps
