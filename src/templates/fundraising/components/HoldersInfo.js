import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { GU, Info, useTheme } from '@aragon/ui'
import { Header, Navigation, ScreenPropsType } from '../../kit'

function HoldersInfo({
  screenProps: { back, data, next, screenIndex, screens },
}) {
  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      next({ ...data })
    },
    [data, next]
  )

  return (
    <div>
      <Header
        title="Organization's token holders"
        subtitle="Read the following information attentively"
      />
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <Paragraph>
          The token holders are the accounts contributing to the fundraising
          campaign. They are represented through a custom bonded-token and a
          voting app. They hold most of the governance rights over the
          organization.
        </Paragraph>

        <Paragraph>Token holders can:</Paragraph>
        <Paragraph>
          <Strong>Buy and redeem tokens.</Strong> Token holders can buy and
          redeem tokens through the Aragon Fundraising interface.
        </Paragraph>
        <Paragraph>
          <Strong>Handle fundraising parameters.</Strong> Token holders decide
          on how beneficiary, fees, and collateralization settings should be
          updated. They also control the amount of funds automatically
          transferred to the council each month.
        </Paragraph>
        <Paragraph>
          <Strong>Handle organization settings.</Strong> Token holders decide on
          which apps can be installed or upgraded and which permissions are set.
        </Paragraph>
      </div>
      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <p>
          This architecture grants most of the governance rights to token
          holders, to protect their contribution. However, this also requires
          the organization to be able to mitigate situations where a token
          holder could own the whole organization by owning more than 50% of the
          shares.
        </p>
        <p
          css={`
            margin-top: ${1 * GU}px;
          `}
        >
          This is why token holder votes, where most of the organization’s
          decisions are made, can only be opened and initiated by the council.
        </p>
      </Info>
      <Navigation
        backEnabled
        nextEnabled
        nextLabel={`Next: ${screens[screenIndex + 1][0]}`}
        onBack={back}
        onNext={handleSubmit}
      />
    </div>
  )
}

HoldersInfo.propTypes = {
  screenProps: ScreenPropsType.isRequired,
}

function Paragraph({ children, ...props }) {
  const theme = useTheme()
  return (
    <p
      css={`
        color: ${theme.contentSecondary};
        & + & {
          margin-top: ${2 * GU}px;
        }
      `}
      {...props}
    >
      {children}
    </p>
  )
}
Paragraph.propTypes = {
  children: PropTypes.node,
}

function Strong({ children, ...props }) {
  const theme = useTheme()
  return (
    <span
      css={`
        color: ${theme.content};
        font-weight: 800;
      `}
      {...props}
    >
      {children}
    </span>
  )
}
Strong.propTypes = {
  children: PropTypes.string,
}

export default HoldersInfo
