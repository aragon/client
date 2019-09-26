import React, { useRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Button, IconArrowLeft, GU, useTheme } from '@aragon/ui'

const Navigation = React.forwardRef(function Navigation(
  { backEnabled, backLabel, nextEnabled, nextLabel, onBack, onNext },
  ref
) {
  const theme = useTheme()

  const nextRef = useRef()

  useImperativeHandle(
    ref,
    () => ({
      focusNext: () => {
        if (nextRef.current) {
          nextRef.current.focus()
        }
      },
    }),
    []
  )

  return (
    <div
      css={`
        display: flex;
        width: 100%;
        justify-content: space-between;
      `}
    >
      <Button
        disabled={!backEnabled}
        icon={
          <IconArrowLeft
            css={`
              color: ${theme.accent};
            `}
          />
        }
        label={backLabel}
        onClick={onBack}
      />
      <Button
        ref={nextRef}
        disabled={!nextEnabled}
        label={nextLabel}
        mode="strong"
        onClick={onNext}
        type="submit"
        css={`
          margin-left: ${1.5 * GU}px;
        `}
      />
    </div>
  )
})

Navigation.propTypes = {
  backEnabled: PropTypes.bool.isRequired,
  backLabel: PropTypes.string.isRequired,
  nextEnabled: PropTypes.bool.isRequired,
  nextLabel: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
}

Navigation.defaultProps = {
  backEnabled: true,
  backLabel: 'Back',
  nextEnabled: true,
  nextLabel: 'Next',
}

export default Navigation
