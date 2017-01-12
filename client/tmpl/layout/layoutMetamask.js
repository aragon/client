// @flow
import { Template } from 'meteor/templating'

const tmpl = Template.Layout_MetaMask

let executed = false

tmpl.onRendered(function () {
  if (executed) return
  executed = true
})
