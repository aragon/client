// @flow

import { Template } from 'meteor/templating'

import Identity from '/client/lib/identity'
import ClosableSection from '/client/tmpl/components/closableSection'
import renderOwnershipInfo from './entityCharts'

const tmpl = Template.Module_Ownership_Entity.extend([ClosableSection])

tmpl.onRendered(function () {
  renderOwnershipInfo()
})

tmpl.helpers({
  entity: ReactivePromise(() => Identity.get(FlowRouter.current().params.address)),
})
