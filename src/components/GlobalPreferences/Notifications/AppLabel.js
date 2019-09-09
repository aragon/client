import React, { useContext, useMemo, useEffect, useState } from 'react'
import { AppBadge, GU, RADIUS, Tag } from '@aragon/ui'
import AppIcon from '../../AppIcon/AppIcon'
import { useLocalIdentity } from '../../../hooks'

const AppLabel = ({ apps, app }) => {
  const {
    name: appName,
    proxyAddress,
    contractAddress,
    icons: [{ src: iconSrc }],
    baseUrl,
    identifier,
  } = app
  //
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
}

export default AppLabel
