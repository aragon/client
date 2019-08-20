import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Card, GU, textStyle, useTheme } from '@aragon/ui'
import { EthereumProviderType } from '../../prop-types'

function ProviderCard({ provider, onConnect }) {
  const theme = useTheme()

  const handleClick = useCallback(() => {
    async function connect() {
      await provider.connect()
      onConnect(provider.id)
    }
    connect()
  }, [onConnect, provider])

  return (
    <Card
      onClick={handleClick}
      css={`
        width: ${24 * GU}px;
        height: ${30 * GU}px;
        & + & {
          margin-left: ${2 * GU}px;
        }
      `}
    >
      <section
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <div
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          <img src={provider.image} alt="" width={10 * GU} />
        </div>
        <h1
          css={`
            ${textStyle('title4')}
            margin-bottom: ${1 * GU}px;
          `}
        >
          {provider.name}
        </h1>
        <p
          css={`
            color: ${theme.contentSecondary};
          `}
        >
          {provider.type}
        </p>
      </section>
    </Card>
  )
}

ProviderCard.propTypes = {
  provider: EthereumProviderType.isRequired,
  onConnect: PropTypes.func.isRequired,
}

export default ProviderCard
