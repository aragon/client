export const Start = Symbol('Start')
export const Template = Symbol('Template')
export const Domain = Symbol('Domain')
export const Configure = Symbol('Configure')
export const Launch = Symbol('Launch')

export const ProgressBarSteps = [
  {
    step: Template,
    label: 'Choose Template',
  },
  {
    step: Domain,
    label: 'Claim Domain',
  },
  {
    step: Configure,
    label: 'Configure',
  },
  {
    step: Launch,
    label: 'Launch',
  },
]
