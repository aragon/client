import React, { useCallback } from 'react'
import { GU, Info, Text } from '@aragon/ui'
import { Header, Navigation, ScreenPropsType } from '../../kit'

function ShareInfo({
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
      <Header title="Second step: shareholders" />
      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <Text.Paragraph>
          The shareholders are the one contributing to the fundraising campaign.
          They are represented through a custom bonded-token - they can buy and
          redeem through the Aragon Fundraising interface - and a voting app.
          They hold most of the rights over the organization.
        </Text.Paragraph>
        <Text.Paragraph>
          <Text weight="bold">Handling system.</Text> Shareholders decide on
          which apps are to be installed, which apps are to to upgraded and how
          permissions are to be set.
        </Text.Paragraph>
        <Text.Paragraph>
          <Text weight="bold">Handling fundraising parameters.</Text>{' '}
          Shareholders decide on whether / how beneficiary, fees,
          collateralization settings and collaterals taps should be updated.
        </Text.Paragraph>
      </Info>
      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <Text.Paragraph>
          This architecture grants most of the governance rights to shareholders
          [to protect their investment]. There is thus a need to mitigate
          situations where a shareholder owning more than 50% of the shares
          would own the whole organization. This is why shareholders votes [i.e.
          most of the organization decisions] can only be open and initiated by
          the board.
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

ShareInfo.propTypes = {
  screenProps: ScreenPropsType.isRequired,
}

ShareInfo.defaultProps = {}

export default ShareInfo
