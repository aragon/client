import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Link, DropDown, GU, Layout, Split, useTheme } from '@aragon/ui'
import { network } from '../../environment'
import { useSuggestedOrgs } from '../../suggested-orgs'
import Header from '../Header/Header'
import OpenOrg from './OpenOrg'
import Suggestions from './Suggestions'
import WelcomeAction from './WelcomeAction'

import actionCreate from './assets/action-create.png'
import actionOpen from './assets/action-open.png'

const Welcome = React.memo(function Welcome({
  createError,
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

  const suggestedOrgs = useSuggestedOrgs()

  const primaryContent = openMode ? (
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
        subtitle={<CreateSubtitle error={createError} />}
        illustration={actionCreate}
        onActivate={onCreate}
        hasError={createError[0] !== null && createError[0] !== 'no-account'}
      />
      <WelcomeAction
        title="Open an existing organization"
        illustration={actionOpen}
        onActivate={onOpen}
      />
    </div>
  )

  return (
    <Layout
      breakpoints={{
        medium: 84 * GU,
        large: 112 * GU,
      }}
    >
      <Header
        title="Welcome to Aragon"
        subtitle="Create your own organization in a few minutes!"
      />

      {suggestedOrgs.length > 0 ? (
        <Split
          primary={primaryContent}
          secondary={<Suggestions suggestedOrgs={suggestedOrgs} />}
        />
      ) : (
        primaryContent
      )}

      <p
        css={`
          padding: ${4 * GU}px 0 ${4 * GU}px;
          text-align: center;
          color: ${theme.contentSecondary};
        `}
      >
        Do you need more information about Aragon?{' '}
        <Link href="https://aragon.org/" external>
          Visit our homepage
        </Link>
      </p>
    </Layout>
  )
})

Welcome.propTypes = {
  createError: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  onOpenOrg: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  openMode: PropTypes.bool.isRequired,
  selectorNetworks: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    .isRequired,
}

function CreateSubtitle({ error }) {
  const theme = useTheme()
  const [errorType, errorData] = error
  if (errorType === 'minimum-balance' || errorType === 'unknown-balance') {
    return (
      <span
        css={`
          color: ${theme.negative};
        `}
      >
        You need at least {errorData.minimumBalance} ETH (
        <strong>
          {errorType === 'unknown-balance'
            ? 'your balance is unknown'
            : `you have ${errorData.balance} ETH`}
        </strong>
        ).
      </span>
    )
  }
  return 'Start your organization with Aragon'
}

CreateSubtitle.propTypes = {
  error: PropTypes.array.isRequired,
}

export default Welcome
