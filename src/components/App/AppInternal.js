import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Root, ScrollView } from '@aragon/ui'
import useAppWidth from '../../apps/useAppWidth'

const RootProvider = Root.Provider

function AppInternal({ children }) {
  const appWidth = useAppWidth()
  return (
    <RootProvider css="height: 100%">
      <ScrollView>
        <Layout parentWidth={appWidth}>{children}</Layout>
      </ScrollView>
    </RootProvider>
  )
}

AppInternal.propTypes = {
  children: PropTypes.node,
}

export default AppInternal
