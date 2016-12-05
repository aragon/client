Template.layout_sidebar.helpers({
  modules: () => (Root.modules.filter(m => (m.sidebarItem))),
  isRouteActive: route => (FlowRouter.getRouteName().includes(route)),
})
