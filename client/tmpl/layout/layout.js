// @flow
import { Template } from 'meteor/templating'
import { $ } from 'meteor/jquery'

const tmpl = Template.Layout

tmpl.onRendered(() => {
  $(document).on('click', (e) => {
    const walletButton = $('#walletButton')
    if (e.target !== walletButton[0] && e.target !== walletButton.find('.icon')[0]) {
      const metaMask = $('#Layout_MetaMask')
      if (metaMask.hasClass('visible')) {
        metaMask.transition('fade down')
      }
    }
  })
})

tmpl.events({
  'click #walletButton': () => $('#Layout_MetaMask').transition('fade down'),
})
