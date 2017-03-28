// @flow
import { Template } from 'meteor/templating'

const tmpl = Template.Setup_JoinOrganization

tmpl.events({
  'click #join': () => {
    const companyAddress = this.$('#companyAddress').val()
    if (!web3.isAddress(companyAddress)) return alert('Not valid address')
    localStorage.setItem('companyAddress', companyAddress)
    location.reload()
  },
})
