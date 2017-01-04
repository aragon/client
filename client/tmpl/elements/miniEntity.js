const tmpl = Template.Element_MiniEntity

tmpl.helpers({
  currentURL: () => FlowRouter.current().path,
})
