import BylawsWatcher from '/client/lib/ethereum/bylaws'

const Bylaws = BylawsWatcher.Bylaws

const bylawForAction = (action) => {
  BylawsWatcher.updateBylaw(action.signature)
  return Bylaws.findOne({ signature: action.signature })
}

export { bylawForAction }
