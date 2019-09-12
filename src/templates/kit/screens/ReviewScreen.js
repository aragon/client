import React, { useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Accordion,
  GU,
  Info,
  KEY_ENTER,
  textStyle,
  useKeyDown,
  useTheme,
} from '@aragon/ui'
import { Header, Navigation } from '..'

function Review({
  screenProps: { back, data, next },
  items,
  screenTitle = 'Review information',
  screenSubtitle = 'Have one last look at your settings below',
}) {
  const theme = useTheme()

  const handleNext = useCallback(() => {
    next(data)
  }, [data, next])

  const containerRef = useRef()
  const prevNextRef = useRef()

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus()
    }
  }, [])

  useKeyDown(KEY_ENTER, () => {
    // Don’t focus too early or the button will get clicked
    setTimeout(() => {
      if (
        document.activeElement === containerRef.current &&
        prevNextRef.current
      ) {
        prevNextRef.current.focusNext()
      }
    }, 0)
  })

  return (
    <div
      ref={containerRef}
      tabIndex="0"
      css={`
        outline: 0;
      `}
    >
      <Header title={screenTitle} subtitle={screenSubtitle} />

      <Accordion
        items={items.map(item => [
          item.label,
          <div
            css={`
              padding: ${7 * GU}px;
            `}
          >
            {item.fields.map(([label, content]) => (
              <section
                key={label}
                css={`
                  & + & {
                    margin-top: ${3 * GU}px;
                  }
                `}
              >
                <h1
                  css={`
                    margin-bottom: ${1 * GU}px;
                    ${textStyle('label2')}
                    color: ${theme.contentSecondary};
                  `}
                >
                  {label}
                </h1>
                <div
                  css={`
                    ${textStyle('body1')};
                  `}
                >
                  {content}
                </div>
              </section>
            ))}
          </div>,
        ])}
      />

      <Info
        css={`
          margin: ${3 * GU}px 0;
        `}
      >
        Carefully review your configuration settings. If something doesn’t look
        right, you can always go back and change it before launching your
        organization.
      </Info>

      <Navigation
        ref={prevNextRef}
        backEnabled
        nextEnabled
        nextLabel="Launch your organization"
        onBack={back}
        onNext={handleNext}
      />
    </div>
  )
}

Review.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      fields: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)).isRequired,
    })
  ).isRequired,
}

export default Review
