// @flow
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { ReactivePromise } from 'meteor/deanius:promise'

import Identity from '/client/lib/identity'
import ClosableSection from '/client/tmpl/components/closableSection'
import renderOwnershipInfo from './entityCharts'

const tmpl = Template.Module_Ownership_Entity.extend([ClosableSection])

tmpl.onCreated(async function () {
  const entity = await Identity.get(FlowRouter.current().params.address)
  TemplateVar.set(this, 'entity', entity)
})

tmpl.onRendered(function () {
  renderOwnershipInfo()
})
