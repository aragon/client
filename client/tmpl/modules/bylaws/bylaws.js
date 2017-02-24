// @flow
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'

import ActionFactory from '/client/lib/action-dispatcher/actions'

const tmpl = Template.Module_Bylaws.extend()

tmpl.routes({
  '/': () => TemplateVar.set('rightSection', 'Module_Bylaws_Empty'),
  '/action/:key': () => TemplateVar.set('rightSection', 'Module_Bylaws_Modify'),
  '/*/entity/:address': () => TemplateVar.set('rightSection', 'Module_Entity'),
})

tmpl.helpers({
  actions: (): Array<Object> => {
    const actions = Object.keys(ActionFactory).map(key => Object.assign(ActionFactory[key], { key }))
    return actions.filter(action => action.isBylaw)
  },
})
