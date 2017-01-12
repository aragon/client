// @flow
import { Template } from 'meteor/templating'
import { $ } from 'meteor/jquery'

const tmpl = Template.Layout

tmpl.onRendered(() => {
  const walletButton = $('#walletButton')
  $(document).on('click', (e) => {
    if (e.target !== walletButton[0] && e.target !== walletButton.find('.icon')[0]) {
      if ($('#Layout_MetaMask').is(':visible')) {
        $('#Layout_MetaMask').transition('fade down')
      }
    }
  })
})

tmpl.events({
  'click #walletButton': () => $('#Layout_MetaMask').transition('fade down'),
})
