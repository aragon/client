import React, { useCallback } from 'react'
import styled from 'styled-components'
import { GU, Info } from '@aragon/ui'
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
      <Header title="First step: the board" />
      <Info
        title="About the board"
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <Paragraph>
          The board acts as the representatives of the project being funded by
          the fundraising campaign. Board members are represented through a
          custom token and enforce their decision via a dedicated voting app set
          to be used as a multisig. Their privileges are intentionnaly limited
          to protect shareholders.
        </Paragraph>
        <Paragraph>Thus, they only have the following rights:</Paragraph>
        <Paragraph>
          <strong>Handling board members.</strong> The board decides on who is
          to be included or excluded from the board.
        </Paragraph>
        <Paragraph>
          <strong>Opening presale.</strong> The board decides on when the
          presale—and thus the fundraising campaign—is started.
        </Paragraph>
        <Paragraph>
          <strong>Handling fundraising proceeds.</strong> The fundraising
          proceeds are periodically transferred to a Vault / Finance app
          controlled by the Board at their discretion.
        </Paragraph>
        <Paragraph>
          <strong>Opening votes.</strong> The board decides on when new votes
          should be opened for shareholders to enforce decisions over the
          organization.
        </Paragraph>
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

BoardInfo.propTypes = {
  screenProps: ScreenPropsType.isRequired,
}

const Paragraph = styled.p`
  & + & {
    margin-top: ${1 * GU}px;
  }
`

export default BoardInfo
