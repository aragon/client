import { canPerformAction } from '/client/lib/action-dispatcher/helpers'
const tmpl = Template.Element_PerformAction

tmpl.helpers({
  canPerform: ReactivePromise(async action => {
    const canIt = await canPerformAction(action)
    return canIt ? '' : 'disabled'
  })
})
