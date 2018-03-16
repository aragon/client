export const Start = Symbol('Start')
export const Template = Symbol('Template')
export const Domain = Symbol('Domain')
export const Configure = Symbol('Configure')
export const Sign = Symbol('Sign')
export const Launch = Symbol('Launch')

export const ProgressBarGroups = [
  { group: Template, label: 'Choose Template' },
  { group: Domain, label: 'Claim Domain' },
  { group: Configure, label: 'Configure' },
  { group: Launch, label: 'Launch' },
]
