import React from 'react'
import PropTypes from 'prop-types'
import { AppBadge } from '@aragon/ui'
import iconSvgAgent from './icons/agent.svg'
import iconSvgFinance from './icons/finance.svg'
import iconSvgFundraising from './icons/fundraising.svg'
import iconSvgPayroll from './icons/payroll.svg'
import iconSvgTokens from './icons/token-manager.svg'
import iconSvgVault from './icons/vault.svg'
import iconSvgVoting from './icons/voting.svg'

const KNOWN_ICONS = new Map([
  ['agent.aragonpm.eth', iconSvgAgent],
  ['aragon-fundraising.aragonpm.eth', iconSvgFundraising],
  ['finance.aragonpm.eth', iconSvgFinance],
  ['payroll.aragonpm.eth', iconSvgPayroll],
  ['token-manager.aragonpm.eth', iconSvgTokens],
  ['vault.aragonpm.eth', iconSvgVault],
  ['voting.aragonpm.eth', iconSvgVoting],
])

function KnownAppBadge({ appName, compact, label }) {
  return <AppBadge badgeOnly iconSrc={KNOWN_ICONS.get(appName)} label={label} />
}
KnownAppBadge.propTypes = {
  appName: PropTypes.string.isRequired,
  compact: PropTypes.bool,
  label: PropTypes.string.isRequired,
}

export default KnownAppBadge
