// @flow
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactivePromise } from 'meteor/deanius:promise'

import ClosableSection from '/client/tmpl/components/closableSection'
import Identity from '/client/lib/identity'

const tmpl = Template.Module_Entity.extend([ClosableSection])

tmpl.helpers({
  entity: ReactivePromise(async () => {
    if (FlowRouter.current()) {
      const address = FlowRouter.current().params.address
      if (address) {
        return await Identity.get(address)
      }
      return Identity.current(false, false)
    }
    return {}
  }),
  formatFingerprint: (fingerprint): string => (fingerprint && fingerprint.match(/.{1,4}/g).join(' ')),
})
