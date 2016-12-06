import ClosableSection from '/client/tmpl/components/closableSection'

const tmpl = Template.Module_Entity.extend([ClosableSection])

tmpl.helpers({
  entity: () => TemplateVar.get(Template.instance().data.parent, 'selectedShareholder'),
})
