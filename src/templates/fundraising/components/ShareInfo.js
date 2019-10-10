import React, { useCallback } from 'react'
import styled from 'styled-components'
import { GU, Info } from '@aragon/ui'
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
        title="About the shareholders"
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <Paragraph>
          The shareholders are the ones contributing to the fundraising
          campaign. They are represented through a custom bonded-token and a
          voting app. They hold most of the governance rights over the
          organization.
        </Paragraph>
        <Paragraph>Shareholders can:</Paragraph>
        <Paragraph>
          <strong>Buy and redeem tokens.</strong> Shareholders can buy and
          redeem tokens through the Aragon Fundraising interface.
        </Paragraph>
        <Paragraph>
          <strong>Handle fundraising parameters.</strong> Shareholders decide on
          how beneficiary, fees, and collateralization settings should be
          updated. They also control the amount of funds automatically
          transferred to the board each month.
        </Paragraph>
        <Paragraph>
          <strong>Handle organization settings.</strong> Shareholders decide on
          which apps are installed or upgraded and which permissions are set.
        </Paragraph>
      </Info>
      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <Paragraph>
          This architecture grants most of the governance rights to
          shareholders, to protect their investment. However, this also requires
          the organization to be able to mitigate situations where a shareholder
          could own the whole organization by owning more than 50% of the
          shares.
        </Paragraph>
        <Paragraph>
          This is why shareholder votes, where most of the organization’s
          decisions are made, can only be opened and initiated by the board.
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

ShareInfo.propTypes = {
  screenProps: ScreenPropsType.isRequired,
}

const Paragraph = styled.p`
  & + & {
    margin-top: ${1 * GU}px;
  }
`

export default ShareInfo
