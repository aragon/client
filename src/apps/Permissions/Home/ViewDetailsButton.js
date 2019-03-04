import React from 'react'
import { Button, ButtonIcon, IconArrowRight, Viewport } from '@aragon/ui'

const ViewDetailsButton = props => (
  <Viewport>
    {({ below }) =>
      below('medium') ? (
        <ButtonIcon {...props}>
          <IconArrowRight />
        </ButtonIcon>
      ) : (
        <Button mode="outline" compact {...props}>
          View details
        </Button>
      )
    }
  </Viewport>
)

export default ViewDetailsButton
