import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonBase,
  Link,
  Card,
  GU,
  IconDown,
  RADIUS,
  textStyle,
  useTheme,
} from '@aragon/ui'

import notFoundImage from '../../assets/dao-not-found.png'

const SUPPORT_URL = 'https://github.com/aragon/aragon/issues/new'

const GenericError = React.memo(function GenericError({
  detailsTitle,
  detailsContent,
  reportCallback,
}) {
  const theme = useTheme()
  const [opened, setOpened] = useState(false)
  const toggle = useCallback(() => {
    setOpened(!opened)
  }, [opened, setOpened])

  return (
    <Card
      css={`
        display: block;
        padding: ${5 * GU}px ${6 * GU}px;
        width: 100%;
        max-width: ${72 * GU}px;
        height: auto;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      `}
    >
      <img
        alt=""
        src={notFoundImage}
        width="147"
        height="144"
        css={`
          display: block;
          margin: ${5 * GU}px auto ${1.5 * GU}px;
        `}
      />
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
        <div
          css={`
            text-align: left;
            margin-bottom: ${5 * GU}px;
          `}
        >
          <ButtonBase
            onClick={toggle}
            css={`
              display: flex;
              align-items: center;
              color: ${theme.surfaceContentSecondary};
              ${textStyle('label2')};
            `}
          >
            Click here to see more details
            <IconDown
              size="tiny"
              css={`
                margin-left: ${0.5 * GU}px;
                transition: transform 150ms ease-in-out;
                transform: rotate3d(0, 0, 1, ${opened ? 180 : 0}deg);
              `}
            />
          </ButtonBase>
          {opened && (
            <div
              css={`
                overflow: auto;
                padding: ${2 * GU}px;
                max-height: 200px;
                border-radius: ${RADIUS}px;
                color: ${theme.text};
                white-space: pre;
                background: ${theme.surfaceUnder};
                ${textStyle('body3')};
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
          )}
        </div>
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
    </Card>
  )
})

GenericError.propTypes = {
  detailsTitle: PropTypes.node,
  detailsContent: PropTypes.node,
  reportCallback: PropTypes.func,
}

export default GenericError
