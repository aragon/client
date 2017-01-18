// @flow
import { TemplateVar } from 'meteor/frozeman:template-var'
import { Template } from 'meteor/templating'

const tmpl = Template.Module_Bylaws.extend()

tmpl.onRendered(function () {
  $('.ui.modal').modal({
    inverted: true,
    // The callbacks are inverted since the recommended action is to cancel
    onApprove: () => {
      console.log('Cancelled')
      BlazeLayout.reset()
    },
    onDeny: () => {
      console.log('Approved')
    },
  })

  setTimeout(showModal.bind(this), 1000)
})

tmpl.helpers({
})

const showModal = () => {
  this.$('.ui.modal').modal('show')
}
