import ClosableSection from '/client/tmpl/components/closableSection'
import Identity from '/client/lib/identity'

import renderOwnershipInfo from './ownership'

const tmpl = Template.Module_Entity.extend([ClosableSection])

const isMode = mode => FlowRouter.current().path.indexOf(mode) > -1

tmpl.onRendered(function () {
  if (isMode('ownership')) {
    requestAnimationFrame(() => renderOwnershipInfo())
  }
})

tmpl.helpers({
  entity: ReactivePromise(async () => {
    if (FlowRouter.current()) {
      const address = FlowRouter.current().params.address
      if (address) {
        return await Identity.get(address)
      }
      return Identity.current()
    }
    return {}
  }),
  formatFingerprint: (fingerprint) => (fingerprint && fingerprint.match(/.{1,4}/g).join(' ')),
  isMode,
})
