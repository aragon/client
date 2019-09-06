import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonText,
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
        display: grid;
        grid-template-rows: 1fr auto auto auto;
        grid-template-columns: 1fr;
        padding: ${5 * GU}px ${6 * GU}px;
        width: ${72 * GU}px;
        height: auto;
        box-shadow: 0px 2px 4px rgba(180, 188, 202, 0.5);
      `}
    >
      <img
        src={notFoundImage}
        alt="DAO not found"
        css={`
          width: 147px;
          height: 144px;
          margin: ${5 * GU}px auto ${1.5 * GU}px;
        `}
      />
      <h1
        css={`
          color: ${theme.feedbackSurfaceContent};
          ${textStyle('title2')};
          margin-bottom: ${1.5 * GU}px;
          text-align: center;
        `}
      >
        An unexpected error has occurred
      </h1>
      <div
        css={`
          color: ${theme.feedbackSurfaceContentSecondary};
          ${textStyle('body2')};
          margin: auto;
          margin-bottom: ${5 * GU}px;
          max-width: ${52 * GU}px;
          text-align: center;
        `}
      >
        Something went wrong! Hit reload to restart the app, or you can
        <ButtonText href={SUPPORT_URL} css="margin: 0 -5px;">
          contact
        </ButtonText>
        us if the problem persists.
      </div>
      {(detailsTitle || detailsContent) && (
        <div
          css={`
            text-align: left;
            margin-bottom: ${5 * GU}px;
          `}
        >
          <ButtonText
            onClick={toggle}
            css={`
              display: flex;
              align-items: center;
              color: ${theme.feedbackSurfaceContentSecondary};
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
          </ButtonText>
          {opened && (
            <div
              css={`
                overflow: auto;
                padding: ${2 * GU}px;
                max-height: 200px;
                border-radius: ${RADIUS}px;
                color: ${theme.text};
                ${textStyle('body3')};
                white-space: pre;
                background: ${theme.theme.surfaceUnder};
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
            ${reportCallback
              ? `
                margin-left: ${1.5 * GU}px;
              `
              : ''}
          `}
        >
          Restart this app
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
