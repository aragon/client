// @flow
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { $ } from 'meteor/jquery'

const tmpl = Template.Setup_MetaMask

tmpl.events({
  'click #setupMetaMask': (e) => {
    window.postMessage({ metaMask: 'show' }, '*')
    $(e.target).text('Continue').attr('id', 'continue')
  },
  'click #continue': (e, tmplIns) => (
    TemplateVar.setTo('#setup', 'step', 'Setup_Welcome')
  ),
})
