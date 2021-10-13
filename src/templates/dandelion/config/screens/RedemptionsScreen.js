import React, { useCallback, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { addressesEqual, Field, GU, Help, Info, isAddress } from '@aragon/ui'
import {
  Header,
  Navigation,
  ScreenPropsType,
  KnownAppBadge,
} from '../../../kit'
import MultiTokenSelector from '../../components/TokenSelector/MultiTokenSelector'
import {
  getDefaultRedeemableTokens,
  TOKEN_FAKE_ADDRESS,
} from '../helpers/tokens'
import { shortenAddress } from '../../../../util/web3'
import { useWallet } from '../../../../contexts/wallet'

function validationError(redeemableTokens) {
  if (redeemableTokens.length === 0) {
    return 'You need to select at least one redeemable token.'
  }

  const notValidAddress = redeemableTokens.some(
    ({ token }) => !isAddress(token.address)
  )

  if (notValidAddress) {
    return 'One or more selected tokens are not valid addresses.'
  }

  return null
}

const EMPTY_TOKEN = { token: { address: '' }, selectedIndex: -1 }

function RedemptionsScreen({
  appLabel,
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
  title,
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}
  const { networkType } = useWallet()

  const [redeemableTokens, setRedeemableTokens] = useState(
    screenData.redeemableTokens && screenData.redeemableTokens.length > 0
      ? screenData.redeemableTokens
      : [EMPTY_TOKEN]
  )

  const [formError, setFormError] = useState(null)

  const prevNextRef = useRef()

  const handleTokenAdded = useCallback(() => {
    setFormError(null)
    setRedeemableTokens(redeemableTokens => [...redeemableTokens, EMPTY_TOKEN])
  }, [])

  const handleTokenRemoved = useCallback(index => {
    setFormError(null)
    setRedeemableTokens(redeemableTokens =>
      redeemableTokens.filter((_, i) => i !== index)
    )
  }, [])

  const handleTokenUpdated = useCallback(
    ({ token: newToken, selectedIndex: newSelectedIndex, componentIndex }) => {
      const duplicate = redeemableTokens.some(
        ({ token }, index) =>
          isAddress(newToken.address) &&
          index !== componentIndex &&
          addressesEqual(token.address, newToken.address)
      )

      if (duplicate) {
        setFormError('Token already selected')
        return
      }

      setFormError(null)

      setRedeemableTokens(redeemableTokens =>
        redeemableTokens.map((item, i) =>
          i === componentIndex
            ? { token: newToken, selectedIndex: newSelectedIndex }
            : item
        )
      )
    },
    [redeemableTokens]
  )

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      const filteredRedeemableTokens = redeemableTokens.filter(
        ({ token }) => token.address !== ''
      )

      const error = validationError(filteredRedeemableTokens)
      setFormError(error)

      if (!error) {
        const screenData = {
          redeemableTokens: filteredRedeemableTokens,
        }
        next(dataKey ? { ...data, [dataKey]: screenData } : screenData)
      }
    },
    [redeemableTokens, next, dataKey, data]
  )

  const nextEnabled = Boolean(redeemableTokens[0].token.address)

  return (
    <form>
      <Header
        title={title}
        subtitle={
          <span
            css={`
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            Choose your
            <span
              css={`
                display: flex;
                margin: 0 ${1.5 * GU}px;
              `}
            >
              <KnownAppBadge
                appName="redemptions.aragonpm.eth"
                label={appLabel}
              />
            </span>
            settings below.
          </span>
        }
      />

      <div
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        <Field
          label={
            <React.Fragment>
              Redeemable tokens
              <Help hint="What are redeemable tokens?">
                <strong>Redeemable tokens</strong> are tokens (ETH or ERC-20)
                that can be redeemed in exchange for the organization's tokens.
                They represent assets held by the organization.
              </Help>
            </React.Fragment>
          }
          css={`
            margin: 0;
          `}
        />
        <MultiTokenSelector
          onAddToken={handleTokenAdded}
          onRemoveToken={handleTokenRemoved}
          onUpdateToken={handleTokenUpdated}
          tokens={redeemableTokens}
          items={getDefaultRedeemableTokens(networkType)}
        />
      </div>

      {formError && (
        <Info
          mode="error"
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          {formError}
        </Info>
      )}

      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        These settings determine which tokens (ETH and ERC-20) held by the
        organization will be eligible for redemption.
      </Info>

      <Navigation
        ref={prevNextRef}
        backEnabled
        nextEnabled={nextEnabled}
        nextLabel={`Next: ${screens[screenIndex + 1][0]}`}
        onBack={back}
        onNext={handleSubmit}
      />
    </form>
  )
}

RedemptionsScreen.propTypes = {
  appLabel: PropTypes.string,
  dataKey: PropTypes.string,
  screenProps: ScreenPropsType.isRequired,
  title: PropTypes.string,
}

RedemptionsScreen.defaultProps = {
  appLabel: 'Redemptions',
  dataKey: 'redemptions',
  title: 'Configure template',
}

function formatReviewFields(screenData) {
  return [
    [
      'Redeemable tokens',
      <div>
        {screenData.redeemableTokens.map(({ token }, index) => (
          <div
            key={index}
            css={`
              display: grid;
              grid-template-columns: 1fr 2fr;
            `}
          >
            <span>{token.symbol || 'Custom token'}</span>
            {!addressesEqual(token.address, TOKEN_FAKE_ADDRESS) && (
              <span> {shortenAddress(token.address)}</span>
            )}
          </div>
        ))}
      </div>,
    ],
  ]
}

RedemptionsScreen.formatReviewFields = formatReviewFields
export default RedemptionsScreen
