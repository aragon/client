import React from 'react'
import { Button, ButtonIcon, IconPlus, Viewport } from '@aragon/ui'

export default props => (
  <Viewport>
    {({ below }) =>
      below('medium') ? (
        <ButtonIcon
          {...props}
          css={`
            width: auto;
            height: 100%;
            padding: 0 20px;
          `}
        >
          <IconPlus />
        </ButtonIcon>
      ) : (
        <Button
          mode="strong"
          {...props}
          css={`
            height: fit-content;
          `}
        >
          Add permission
        </Button>
      )
    }
  </Viewport>
)
