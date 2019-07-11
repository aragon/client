import React from 'react'
import PropTypes from 'prop-types'
import { Button, GU, useTheme } from '@aragon/ui'
import noResultsSvg from './no-results.svg'

function EmptyFilteredIdentities({ onClear }) {
  const theme = useTheme()

  return (
    <div
      css={`
        margin-top: ${4 * GU}px;
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <img
        css={`
          margin: ${4 * GU}px 0;
        `}
        src={noResultsSvg}
        alt="No results"
      />
      <h3
        css={`
          font-size: 28px;
          color: ${theme.content};
        `}
      >
        No results found.
      </h3>
      <div
        css={`
          text-align: center;
          margin-bottom: ${4 * GU}px;
          color: ${theme.surfaceContentSecondary};
        `}
      >
        We can’t find any item matching your search query.{' '}
        <Button
          css={`
            color: ${theme.link};
            border: none;
            background: none;
            border-radius: 0;
            box-shadow: none;
            padding: 0;
            min-width: unset;
          `}
          onClick={onClear}
        >
          Clear search
        </Button>
      </div>
    </div>
  )
}

EmptyFilteredIdentities.propTypes = {
  onClear: PropTypes.func.isRequired,
}

export default React.memo(EmptyFilteredIdentities)
