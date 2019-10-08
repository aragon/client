import React, { useCallback } from 'react'
import { GU, Info, Text } from '@aragon/ui'
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
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <Text.Paragraph>
          The board is the representative of the project being funded by the
          fundraising campaign. Board members are represented through a custom
          token and enforce their decision through a dedicated voting app set to
          be used as a multisig. Their privileges are intentionnaly limited to
          protect shareholders. Thus, they only have the following rights.
        </Text.Paragraph>
        <Text.Paragraph>
          <Text weight="bold">Handling board members.</Text> The board decides
          on who is to be included / excluded from the board.
        </Text.Paragraph>
        <Text.Paragraph>
          <Text weight="bold">Opening presale.</Text> The board decides on when
          the presale - and thus the fundraising campaign - is to be open.
        </Text.Paragraph>
        <Text.Paragraph>
          <Text weight="bold">Handling fundraising proceeds.</Text> The board
          decides on what use is to be made of the fundraising proceeds which
          are periodically transferred to their discretionnary Vault / Finance
          app.
        </Text.Paragraph>
        <Text.Paragraph>
          <Text weight="bold">Opening votes.</Text> The board decides on when
          new votes should be open for shareholders to enforce decisions over
          the organization.
        </Text.Paragraph>
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

BoardInfo.defaultProps = {}

export default BoardInfo
