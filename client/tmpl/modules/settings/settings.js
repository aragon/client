// @flow
import { TemplateVar } from 'meteor/frozeman:template-var'
import { Template } from 'meteor/templating'

import Settings from '/client/lib/settings'

import currencies from './currencies'

const tmpl = Template.Module_Settings.extend()

tmpl.onRendered(function () {
  this.$('.dropdown').dropdown({
    fullTextSearch: true,
    onChange: cur => Settings.set('displayCurrency', cur),
  })
})

tmpl.events({
})

tmpl.helpers({
  currencies: () => (
    Object.keys(currencies).map((symbol) => ({ name: currencies[symbol], symbol }))
  ),
})
