import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { GU, useTheme } from '@aragon/ui'
import { Header, Navigation, ScreenPropsType } from '../../kit'

function CouncilInfo({
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
        title="Organization's council"
        subtitle="Read the following information attentively"
      />
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <Paragraph>
          The council acts as the project team being funded by the fundraising
          campaign. Council members are represented through a custom token and
          enforce their decisions via a dedicated voting app that acts similarly
          to a traditional multisig account. Their privileges are intentionally
          limited to protect token holders.
        </Paragraph>
        <Paragraph>The council only has the ability to:</Paragraph>
        <Paragraph>
          <Strong>Manage council members.</Strong> The council decides on who is
          to be included or excluded from the council.
        </Paragraph>
        <Paragraph>
          <Strong>Open the presale.</Strong> The council decides on when the
          presale—and thus the fundraising campaign—is started.
        </Paragraph>
        <Paragraph>
          <Strong>Handle the fundraising's proceeds.</Strong> The fundraising
          proceeds are periodically transferred to a Vault / Finance app
          controlled by the council at their discretion.
        </Paragraph>
        <Paragraph>
          <Strong>Open token holder votes.</Strong> The council decides on when
          new votes should be opened for token holders to enforce decisions over
          the organization.
        </Paragraph>
      </div>
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

CouncilInfo.propTypes = {
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

export default CouncilInfo
