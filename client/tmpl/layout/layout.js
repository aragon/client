// @flow
import { Template } from 'meteor/templating'
import { $ } from 'meteor/jquery'

const tmpl = Template.Layout

tmpl.events({
  'click #walletButton': () => {
    const metaMask = $('#Layout_MetaMask')
    const direction = metaMask.is(':visible') ? 'up' : 'down'
    metaMask.transition(`fade ${direction}`)
  },
})
