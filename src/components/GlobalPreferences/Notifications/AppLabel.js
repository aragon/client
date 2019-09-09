import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { GU, RADIUS, Tag } from '@aragon/ui'
import AppIcon from '../../AppIcon/AppIcon'
import { useLocalIdentity } from '../../../hooks'
import { AppType } from '../../../prop-types'

const AppLabel = React.memo(function AppLabel({ apps, app }) {
  const { name: appName, proxyAddress, contractAddress, identifier } = app
  const [label, setLabel] = useState(appName)
  const { name } = useLocalIdentity(proxyAddress)
  const onlyOneInstance =
    apps.filter(a => a.contractAddress === contractAddress).length === 1

  useEffect(() => {
    const getLabel = async () => {
      // in order of priority
      // custom label
      // if more than one instance app name + app identifier
      // app name
      if (name) {
        setLabel(name)
        return
      }

      if (!onlyOneInstance && identifier) {
        setLabel(
          <span>
            {appName}{' '}
            <Tag
              mode="identifier"
              css={`
                margin-left: ${1 * GU}px;
              `}
            >
              {identifier}
            </Tag>
          </span>
        )
        return
      }

      setLabel(appName)
    }

    getLabel()
  }, [appName, identifier, onlyOneInstance, apps, name])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <AppIcon
        app={app}
        radius={RADIUS}
        css={`
          width: ${3 * GU}px;
          margin-right: ${1 * GU}px;
        `}
      />
      {label}
    </div>
  )
})

AppLabel.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  app: AppType.isRequired,
}

export default AppLabel
