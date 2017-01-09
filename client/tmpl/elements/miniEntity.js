// @flow
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'

const tmpl = Template.Element_MiniEntity

tmpl.helpers({
  currentURL: () => FlowRouter.current().path,
})
