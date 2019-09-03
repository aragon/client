import React from 'react'
import { Button, IconArrowLeft, useTheme } from '@aragon/ui'

function PrevNextFooter({
  onNext,
  onBack,
  nextEnabled = true,
  backEnabled = true,
  nextLabel = 'Next',
  backLabel = 'Back',
}) {
  const theme = useTheme()
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
        disabled={!nextEnabled}
        label={nextLabel}
        mode="strong"
        onClick={onNext}
      />
    </div>
  )
}

export default PrevNextFooter
