import React, { useContext, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { AppBadge, GU, Tag } from '@aragon/ui'
import { useLocalIdentity } from '../../hooks'
import { AppType } from '../../prop-types'
import LocalLabelPopoverTitle from './LocalLabelPopoverTitle'
import LocalLabelPopoverActionLabel from './LocalLabelPopoverActionLabel'
import { LocalIdentityModalContext } from '../LocalIdentityModal/LocalIdentityModalManager'
import {
  IdentityContext,
  identityEventTypes,
} from '../IdentityManager/IdentityManager'

const LocalLabelAppBadge = React.memo(function LocalLabelAppBadge({
  apps,
  app,
  noIdentifier,
  ...props
}) {
  const {
    name: appName,
    proxyAddress,
    contractAddress,
    identifier,
    icons: [{ src: iconSrc }],
  } = app
  const [label, setLabel] = useState(appName)
  const { name, handleResolve } = useLocalIdentity(proxyAddress)
  const { showLocalIdentityModal } = useContext(LocalIdentityModalContext)
  const { identityEvents$ } = useContext(IdentityContext)
  const onlyOneInstance =
    apps.filter(a => a.contractAddress === contractAddress).length === 1

  useEffect(() => {
    setLabel(name || appName)
  }, [appName, name])

  const handleClick = useCallback(() => {
    showLocalIdentityModal(proxyAddress)
      .then(handleResolve)
      .then(() =>
        identityEvents$.next({ type: identityEventTypes.MODIFY, proxyAddress })
      )
      .catch(e => {
        /* user cancelled modify intent */
      })
  }, [proxyAddress, identityEvents$, handleResolve, showLocalIdentityModal])

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
        iconSrc={iconSrc}
        {...props}
        popoverAction={{
          label: <LocalLabelPopoverActionLabel hasLabel={Boolean(label)} />,
          onClick: handleClick,
        }}
        popoverTitle={
          label ? <LocalLabelPopoverTitle label={label} /> : undefined
        }
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

LocalLabelAppBadge.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  app: AppType.isRequired,
  noIdentifier: PropTypes.bool,
  editLabel: PropTypes.bool,
}

export default LocalLabelAppBadge
