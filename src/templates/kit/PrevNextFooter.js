import React, { useRef, useImperativeHandle } from 'react'
import { Button, IconArrowLeft, useTheme, useViewport } from '@aragon/ui'

const PrevNextFooter = React.forwardRef(function PrevNextFooter(
  {
    onNext,
    onBack,
    nextEnabled = true,
    backEnabled = true,
    nextLabel = 'Next',
    backLabel = 'Back',
  },
  ref
) {
  const theme = useTheme()
  const { above } = useViewport()

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
      {above('medium') && (
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
      )}
      <Button
        ref={nextRef}
        disabled={!nextEnabled}
        label={nextLabel}
        mode="strong"
        onClick={onNext}
        wide={!above('medium')}
        type="submit"
      />
    </div>
  )
})

export default PrevNextFooter
