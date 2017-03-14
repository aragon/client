// @flow
import { Template } from 'meteor/templating'

const tmpl = Template.Module_Home

tmpl.events({
  'click #openNotifs': () => ($('#inboxButton').click()),
})
