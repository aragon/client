import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { GU } from '@aragon/ui'
import { Header, KnownAppBadge, Navigation, ScreenPropsType } from '../../kit'
import RadioCardList from './RadioCardList'
import oneTokenIllustrationSrc from './assets/oneToken.svg'
import twoTokensIllustrationSrc from './assets/twoTokens.svg'

const radioCardItems = [
  {
    description:
      'Set up your organization with one Tokens app. Recommended for simple governance and equal membership structures.',
    helpText: 'Create one token',
    illustration: oneTokenIllustrationSrc,
    title: 'One token organization',
  },
  {
    description:
      'Set up your organization with two Tokens app. This structure allows for more complex governance processes in the organization.',
    helpText: 'Create two tokens',
    illustration: twoTokensIllustrationSrc,
    title: 'Two token organization',
  },
]

function TokenSelection({ screenProps: { back, data, next }, title }) {
  const screenData = data.selectedTokens

  const [selectedTokens, selectTokens] = useState(
    screenData > 0 ? screenData - 1 : -1
  )

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      const mergedData = { ...data, selectedTokens: selectedTokens + 1 }
      next(mergedData)
    },
    [data, next, selectedTokens]
  )

  return (
    <div>
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
            Select the number of
            <span
              css={`
                display: flex;
                margin: 0 ${1.5 * GU}px;
              `}
            >
              <KnownAppBadge
                appName="token-manager.aragonpm.eth"
                label="Tokens"
              />
            </span>
            in your organization.
          </span>
        }
      />
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <RadioCardList
          items={radioCardItems}
          onChange={selectTokens}
          selected={selectedTokens}
        />
      </div>
      <Navigation
        backEnabled
        nextEnabled={selectedTokens > -1}
        nextLabel={`Next:${selectedTokens > 0 ? ' First ' : ' '}Tokens`}
        onBack={back}
        onNext={handleSubmit}
      />
    </div>
  )
}

TokenSelection.propTypes = {
  screenProps: ScreenPropsType.isRequired,
  title: PropTypes.string,
}

TokenSelection.defaultProps = {
  title: 'Configure template',
}

export default TokenSelection
