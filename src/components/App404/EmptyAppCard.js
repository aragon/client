import React from 'react'
import { styled, Button, EmptyStateCard, IconSettings } from '@aragon/ui'

const EmptyAppCard = ({ appId }) => (
  <StyledEmptyStateCard
    actionButton={StyledAnchorButton}
    actionText="Contact us"
    icon={IconSettings}
    text={`Make sure this organization has properly installed this application.`}
    title={`"${appId}" is not installed`}
  />
)

const StyledEmptyStateCard = styled(EmptyStateCard)`
  padding: 40px 20px;
  margin-bottom: 15px;
`

const StyledAnchorButton = styled(Button.Anchor).attrs({
  href: 'mailto:help@aragon.one',
})`
  width: 150px;
  margin-top: 20px;
`

export default EmptyAppCard
