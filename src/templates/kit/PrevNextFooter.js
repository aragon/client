import React from 'react'
import { Button, IconArrowLeft, useTheme, useViewport } from '@aragon/ui'

function PrevNextFooter({
  onNext,
  onBack,
  nextEnabled = true,
  backEnabled = true,
  nextLabel = 'Next',
  backLabel = 'Back',
}) {
  const theme = useTheme()
  const { above } = useViewport()
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
        disabled={!nextEnabled}
        label={nextLabel}
        mode="strong"
        onClick={onNext}
        wide={!above('medium')}
      />
    </div>
  )
}

export default PrevNextFooter
