import React from 'react'
import PropTypes from 'prop-types'
import { CardLayout } from '@aragon/ui'
import { AppType } from '../../../prop-types'
import AppCard from '../../../components/AppCard/AppCard'
import EmptyBlock from '../EmptyBlock'

function Apps({ apps, loading, onOpenApp }) {
  if (loading) {
    return <EmptyBlock>Loading apps…</EmptyBlock>
  }

  if (apps.length === 0) {
    return <EmptyBlock>No apps installed.</EmptyBlock>
  }

  return (
    <CardLayout rowHeight={170}>
      {apps.map(app => (
        <AppCard key={app.proxyAddress} app={app} onOpen={onOpenApp} />
      ))}
    </CardLayout>
  )
}

Apps.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  loading: PropTypes.bool.isRequired,
  onOpenApp: PropTypes.func.isRequired,
}

export default Apps
