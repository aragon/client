import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { AppBadge, GU, Tag } from '@aragon/ui'
import { useLocalIdentity } from '../../../hooks'
import { AppType } from '../../../prop-types'

const AppLabel = React.memo(function AppLabel({ apps, app, noIdentifier }) {
  const {
    name: appName,
    proxyAddress,
    contractAddress,
    identifier,
    icons: [{ src: iconSrc }],
  } = app
  const [label, setLabel] = useState(appName)
  const { name } = useLocalIdentity(proxyAddress)
  const onlyOneInstance =
    apps.filter(a => a.contractAddress === contractAddress).length === 1

  useEffect(() => {
    setLabel(name || appName)
  }, [appName, name])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
      `}
    >
      <AppBadge
        appAddress={app.contractAddress}
        label={label}
        compact
        iconSrc={iconSrc}
      />
      {!onlyOneInstance && !noIdentifier && !name && (
        <Tag
          mode="identifier"
          css={`
            margin-left: ${1 * GU}px;
          `}
        >
          {identifier}
        </Tag>
      )}
    </div>
  )
})

AppLabel.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  app: AppType.isRequired,
  noIdentifier: PropTypes.bool,
}

export default AppLabel
