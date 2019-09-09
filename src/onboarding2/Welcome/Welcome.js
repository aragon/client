import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { ButtonText, DropDown, GU, Layout, Split, useTheme } from '@aragon/ui'
import { network } from '../../environment'
import Header from '../Header/Header'
import OpenOrg from './OpenOrg'
import Suggestions from './Suggestions'
import WelcomeAction from './WelcomeAction'

import actionCreate from './assets/action-create.png'
import actionOpen from './assets/action-open.png'

function Welcome({
  onBack,
  onCreate,
  onOpen,
  onOpenOrg,
  openMode,
  selectorNetworks,
}) {
  const theme = useTheme()

  const selectorNetworksSorted = useMemo(() => {
    return selectorNetworks
      .map(([type, name, url]) => ({ type, name, url }))
      .sort((a, b) => {
        if (b.type === network.type) return 1
        if (a.type === network.type) return -1
        return 0
      })
  }, [selectorNetworks])

  const changeNetwork = useCallback(
    index => {
      window.location = selectorNetworksSorted[index].url
    },
    [selectorNetworksSorted]
  )

  return (
    <div
      css={`
        display: grid;
        align-items: center;
        justify-content: center;
      `}
    >
      <Layout
        breakpoints={{
          medium: 84 * GU,
          large: 112 * GU,
        }}
      >
        <Header
          title="Welcome to Aragon"
          subtitle="Create your own organization and token in a few minutes!"
        />

        <Split
          primary={
            openMode ? (
              <OpenOrg onBack={onBack} onOpenOrg={onOpenOrg} />
            ) : (
              <div>
                <DropDown
                  items={selectorNetworksSorted.map(network => network.name)}
                  placeholder={selectorNetworksSorted[0].name}
                  onChange={changeNetwork}
                  wide
                />
                <WelcomeAction
                  title="Create an organization"
                  subtitle="You need at least 0.1 ETH"
                  illustration={actionCreate}
                  onActivate={onCreate}
                />
                <WelcomeAction
                  title="Open an existing organization"
                  subtitle="Find an existing organization"
                  illustration={actionOpen}
                  onActivate={onOpen}
                />
              </div>
            )
          }
          secondary={<Suggestions />}
        />

        <p
          css={`
            padding: ${4 * GU}px 0 ${4 * GU}px;
            text-align: center;
            color: ${theme.contentSecondary};
          `}
        >
          Do you need more information about Aragon?{' '}
          <ButtonText href="https://wiki.aragon.org/" external>
            Visit our Wiki
          </ButtonText>
        </p>
      </Layout>
    </div>
  )
}

Welcome.propTypes = {
  onBack: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  openMode: PropTypes.bool.isRequired,
  selectorNetworks: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default Welcome