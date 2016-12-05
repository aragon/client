Template.layout_sidebar.helpers({
  modules: () => (Root.modules.filter(m => (m.name !== 'inbox'))),
  isRouteActive: route => (FlowRouter.getRouteName().includes(route)),
})
