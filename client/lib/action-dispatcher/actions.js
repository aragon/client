class Action {
  constructor(signature, name, description = 'Action description goes here') {
    this.signature = signature
    this.name = name
    this.description = description
  }
}

const allActions = [
  new Action('beginPoll(address,uint64)', 'Begin voting'),
  new Action('castVote(uint256,uint8)', 'Cast vote'),
]

export default allActions
