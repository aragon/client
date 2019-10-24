import React from 'react'
import PropTypes from 'prop-types'
import { AppBadge } from '@aragon/ui'
import iconSvgAddressBook from './icons/address-book.svg'
import iconSvgAgent from './icons/agent.svg'
import iconSvgAllocations from './icons/allocations.svg'
import iconSvgDotVoting from './icons/dot-voting.svg'
import iconSvgFinance from './icons/finance.svg'
import iconSvgFundraising from './icons/fundraising.svg'
import iconSvgPayroll from './icons/payroll.svg'
import iconSvgProjects from './icons/projects.svg'
import iconSvgRewards from './icons/rewards.svg'
import iconSvgTokens from './icons/token-manager.svg'
import iconSvgVault from './icons/vault.svg'
import iconSvgVoting from './icons/voting.svg'

const KNOWN_ICONS = new Map([
  ['address-book.aragonpm.eth', iconSvgAddressBook],
  ['agent.aragonpm.eth', iconSvgAgent],
  ['allocations.aragonpm.eth', iconSvgAllocations],
  ['aragon-fundraising.aragonpm.eth', iconSvgFundraising],
  ['dot-voting.aragonpm.eth', iconSvgDotVoting],
  ['finance.aragonpm.eth', iconSvgFinance],
  ['payroll.aragonpm.eth', iconSvgPayroll],
  ['projects.aragonpm.eth', iconSvgProjects],
  ['rewards.aragonpm.eth', iconSvgRewards],
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
