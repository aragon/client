import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Details,
  GU,
  Link,
  RADIUS,
  textStyle,
  useTheme,
} from '@aragon/ui'

const SUPPORT_URL = 'https://github.com/aragon/aragon/issues/new'

const GenericError = React.memo(function GenericError({
  detailsTitle,
  detailsContent,
  reportCallback,
}) {
  const theme = useTheme()

  return (
    <React.Fragment>
      <h1
        css={`
          color: ${theme.surfaceContent};
          ${textStyle('title2')};
          margin-bottom: ${1.5 * GU}px;
          text-align: center;
        `}
      >
        An unexpected error has occurred
      </h1>
      <p
        css={`
          margin-bottom: ${5 * GU}px;
          text-align: center;
          color: ${theme.surfaceContentSecondary};
          ${textStyle('body2')};
        `}
      >
        Something went wrong! Hit reload to restart the app, or you can{' '}
        <Link href={SUPPORT_URL}>contact</Link> us if the problem persists.
      </p>
      {(detailsTitle || detailsContent) && (
        <Details
          label={
            <span
              css={`
                margin-left: ${-1 * GU}px;
              `}
            >
              Click here to see more details
            </span>
          }
        >
          <div
            css={`
              overflow: auto;
              padding: ${2 * GU}px;
              max-height: ${25 * GU}px;
              border-radius: ${RADIUS}px;
              color: ${theme.surfaceContent};
              white-space: pre;
              background: ${theme.surfaceUnder};
              ${textStyle('body3')};
              text-align: left;
            `}
          >
            {detailsTitle && (
              <h2
                css={`
                  ${textStyle('body2')};
                  margin-bottom: ${1.5 * GU}px;
                `}
              >
                {detailsTitle}
              </h2>
            )}
            {detailsContent}
          </div>
        </Details>
      )}
      <div
        css={`
          ${reportCallback
            ? `
              display: flex;
              justify-content: flex-end;
            `
            : ''}
        `}
      >
        {reportCallback && (
          <Button onClick={reportCallback}>Send Report</Button>
        )}
        <Button
          mode="strong"
          onClick={() => window.location.reload(true)}
          wide={!reportCallback}
          css={`
            margin-left: ${reportCallback ? 1.5 * GU : 0}px;
          `}
        >
          Reload
        </Button>
      </div>
    </React.Fragment>
  )
})

GenericError.propTypes = {
  detailsTitle: PropTypes.node,
  detailsContent: PropTypes.node,
  reportCallback: PropTypes.func,
}

export default GenericError
