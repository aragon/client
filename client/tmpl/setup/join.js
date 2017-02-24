// @flow
import { Template } from 'meteor/templating'

const tmpl = Template.Setup_JoinOrganization

tmpl.events({
  'click #join': () => {
    localStorage.setItem('companyAddress', this.$('#companyAddress').val())
    location.reload()
  },
})
