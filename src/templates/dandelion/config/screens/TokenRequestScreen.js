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
import { getDefaultAcceptedTokens, TOKEN_FAKE_ADDRESS } from '../helpers/tokens'
import { shortenAddress } from '../../../../util/web3'
import { useWallet } from '../../../../contexts/wallet'

function validationError(acceptedTokens) {
  if (acceptedTokens.length === 0) {
    return 'You need to select at least one accepted token.'
  }

  const notValidAddress = acceptedTokens.some(
    ({ token }) => !isAddress(token.address)
  )

  if (notValidAddress) {
    return 'One or more selected tokens are not valid addresses.'
  }

  return null
}

const EMPTY_TOKEN = { token: { address: '' }, selectedIndex: -1 }

function TokenRequestScreen({
  appLabel,
  dataKey,
  screenProps: { back, data, next, screenIndex, screens },
  title,
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}
  const { networkType } = useWallet()

  const [acceptedTokens, setAcceptedTokens] = useState(
    screenData.acceptedTokens && screenData.acceptedTokens.length > 0
      ? screenData.acceptedTokens
      : [EMPTY_TOKEN]
  )

  const [formError, setFormError] = useState(null)

  const prevNextRef = useRef()

  const handleTokenAdded = useCallback(() => {
    setFormError(null)
    setAcceptedTokens(acceptedTokens => [...acceptedTokens, EMPTY_TOKEN])
  }, [])

  const handleTokenRemoved = useCallback(index => {
    setFormError(null)
    setAcceptedTokens(acceptedTokens =>
      acceptedTokens.filter((_, i) => i !== index)
    )
  }, [])

  const handleTokenUpdated = useCallback(
    ({ token: newToken, selectedIndex: newSelectedIndex, componentIndex }) => {
      const duplicate = acceptedTokens.some(
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

      setAcceptedTokens(acceptedTokens =>
        acceptedTokens.map((item, i) =>
          i === componentIndex
            ? { token: newToken, selectedIndex: newSelectedIndex }
            : item
        )
      )
    },
    [acceptedTokens]
  )

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      const filteredAcceptedTokens = acceptedTokens.filter(
        ({ token }) => token.address !== ''
      )

      const error = validationError(filteredAcceptedTokens)
      setFormError(error)

      if (!error) {
        const screenData = {
          acceptedTokens: filteredAcceptedTokens,
        }
        next(dataKey ? { ...data, [dataKey]: screenData } : screenData)
      }
    },
    [acceptedTokens, next, dataKey, data]
  )

  const nextEnabled = Boolean(acceptedTokens[0].token.address)

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
                appName="token-request.aragonpm.eth"
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
              Accepted Tokens
              <Help hint="What are the accepted tokens?">
                <strong>Accepted tokens</strong> are ERC20 tokens that will be
                accepted as payment in exchange for the organization's tokens
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
          tokens={acceptedTokens}
          items={getDefaultAcceptedTokens(networkType)}
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
        These settings will determine which assets will be accepted as payment
        in exchange for the organization's tokens.
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

TokenRequestScreen.propTypes = {
  appLabel: PropTypes.string,
  dataKey: PropTypes.string,
  screenProps: ScreenPropsType.isRequired,
  title: PropTypes.string,
}

TokenRequestScreen.defaultProps = {
  appLabel: 'Token Request',
  dataKey: 'tokenRequest',
  title: 'Configure template',
}

function formatReviewFields(screenData) {
  return [
    [
      'Accepted tokens',
      <div>
        {screenData.acceptedTokens.map(({ token }, index) => (
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

TokenRequestScreen.formatReviewFields = formatReviewFields
export default TokenRequestScreen
