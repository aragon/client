import { TemplateVar } from 'meteor/frozeman:template-var'

const tmpl = Template.Element_CurrencyAmount

tmpl.events({
  'input input': e => TemplateVar.set('amount', parseFloat($(e.target).val())),
})
