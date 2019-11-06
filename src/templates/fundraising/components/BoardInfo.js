import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { GU, useTheme } from '@aragon/ui'
import { Header, Navigation, ScreenPropsType } from '../../kit'

function BoardInfo({
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
        title="Organization's board"
        subtitle="Read the following information attentively"
      />
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <Paragraph>
          The board acts as the representatives of the project being funded by
          the fundraising campaign. Board members are represented through a
          custom token and enforce their decision via a dedicated voting app set
          to be used as a multisig. Their privileges are intentionally limited
          to protect shareholders.
        </Paragraph>
        <Paragraph>The board only has the ability to:</Paragraph>
        <Paragraph>
          <Strong>Handle board members.</Strong> The board decides on who is to
          be included or excluded from the board.
        </Paragraph>
        <Paragraph>
          <Strong>Open the presale.</Strong> The board decides on when the
          presale—and thus the fundraising campaign—is started.
        </Paragraph>
        <Paragraph>
          <Strong>Handle the fundraising's proceeds.</Strong> The fundraising
          proceeds are periodically transferred to a Vault / Finance app
          controlled by the Board at their discretion.
        </Paragraph>
        <Paragraph>
          <Strong>Open shareholder votes.</Strong> The board decides on when new
          votes should be opened for shareholders to enforce decisions over the
          organization.
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

BoardInfo.propTypes = {
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

const Strong = styled.strong`
  font-weight: 800;
`

export default BoardInfo
