import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { ButtonBase, GU, Link, RADIUS, useTheme, textStyle } from '@aragon/ui'
import { getProviderFromUseWalletId } from 'use-wallet'
import { connectors } from '../../ethereum-providers/connectors'

function ProviderButton({ id, provider, onActivate }) {
  const theme = useTheme()

  const handleClick = useCallback(() => {
    onActivate(id)
  }, [onActivate, id])

  return (
    <ButtonBase
      key={id}
      onClick={handleClick}
      css={`
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: ${12 * GU}px;
        background: ${theme.surface};
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
        border-radius: ${RADIUS}px;
        &:active {
          top: 1px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}
    >
      <img src={provider.image} alt="" height={5.25 * GU} />
      <div
        css={`
          margin-top: ${1 * GU}px;
          ${textStyle('body1')};
        `}
      >
        {provider.name}
      </div>
    </ButtonBase>
  )
}
ProviderButton.propTypes = {
  id: PropTypes.string.isRequired,
  onActivate: PropTypes.func.isRequired,
  provider: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
}

function AccountModuleProvidersScreen({ onActivate }) {
  const providersInfo = useMemo(() => {
    return connectors.map(provider => [
      provider.id,
      getProviderFromUseWalletId(provider.id),
    ])
  }, [])

  return (
    <div>
      <div
        css={`
          display: grid;
          grid-gap: ${1.5 * GU}px;
          grid-auto-flow: row;
          grid-template-columns: repeat(2, 1fr);
          padding: ${2 * GU}px;
        `}
      >
        {providersInfo.map(([id, provider]) => (
          <ProviderButton
            key={id}
            id={id}
            provider={provider}
            onActivate={onActivate}
          />
        ))}
      </div>
      <div
        css={`
          display: flex;
          justify-content: center;
          padding: 0 ${2 * GU}px ${1 * GU}px;
        `}
      >
        <Link href="https://ethereum.org/wallets/" css="text-decoration: none">
          Don’t have an account?
        </Link>
      </div>
    </div>
  )
}
AccountModuleProvidersScreen.propTypes = {
  onActivate: PropTypes.func.isRequired,
}

export default AccountModuleProvidersScreen
