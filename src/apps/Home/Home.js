import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { CardLayout, Card, GU, textStyle, useLayout } from '@aragon/ui'
import { AppType } from '../../prop-types'
import appIds from '../../known-app-ids'

import imgEagle from '../../assets/eagle.svg'
import imgAssignTokens from './assets/assign-tokens.png'
import imgCheckFinance from './assets/check-finance.png'
import imgNewPayment from './assets/new-payment.png'
import imgCreateNewVote from './assets/create-new-vote.png'

const EAGLE_DIMENSIONS = [1241, 833]

const ACTIONS = [
  {
    label: 'Assign Tokens',
    appId: appIds['TokenManager'],
    img: imgAssignTokens,
  },
  {
    label: 'Vote',
    appId: appIds['Voting'],
    img: imgCreateNewVote,
  },
  {
    label: 'Check Finance',
    appId: appIds['Finance'],
    img: imgCheckFinance,
  },
  {
    label: 'New Payment',
    appId: appIds['Finance'],
    img: imgNewPayment,
  },
]

function Home({ apps, onOpenApp }) {
  const { layoutWidth, layoutName } = useLayout()

  const appActions = useMemo(
    () =>
      ACTIONS.filter(
        ({ appId }) => apps.findIndex(app => app.appId === appId) > -1
      ),
    [apps]
  )

  const handleOpen = useCallback(
    appId => {
      const app = apps.find(app => app.appId === appId)
      if (app && onOpenApp) {
        onOpenApp(app.proxyAddress)
      }
    },
    [onOpenApp, apps]
  )

  return (
    <div
      css={`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: grid;
        align-items: center;
        justify-content: center;
        background: fixed ${layoutName === 'small' ? '0%' : '50%'} 100% /
          ${EAGLE_DIMENSIONS[0]}px ${EAGLE_DIMENSIONS[1]}px no-repeat
          url(${imgEagle});
        overflow: auto;
      `}
    >
      <div
        css={`
          position: relative;
          z-index: 2;
          width: ${layoutWidth}px;
          padding: ${6 * GU}px 0;
        `}
      >
        <h1
          css={`
            margin-bottom: ${6 * GU}px;
            ${textStyle('title2')}
            text-align: center;
          `}
        >
          What do you want to do?
        </h1>
        <CardLayout rowHeight={33 * GU} columnWidthMin={31 * GU}>
          {appActions.map(({ appId, img, label }, index) => (
            <HomeCard
              key={index}
              appId={appId}
              img={img}
              label={label}
              onOpen={handleOpen}
            />
          ))}
        </CardLayout>
      </div>
    </div>
  )
}

Home.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  onOpenApp: PropTypes.func.isRequired,
}

function HomeCard({ onOpen, appId, label, img }) {
  const handleClick = useCallback(() => {
    onOpen(appId)
  }, [onOpen, appId])

  return (
    <Card
      onClick={handleClick}
      css={`
        display: flex;
        flex-direction: column;
      `}
    >
      <img src={img} alt="" width="184" height="145" />
      <p
        css={`
          margin-top: ${2 * GU}px;
          ${textStyle('title4')};
        `}
      >
        {label}
      </p>
    </Card>
  )
}

HomeCard.propTypes = {
  onOpen: PropTypes.func.isRequired,
  appId: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
}

export default React.memo(Home)
