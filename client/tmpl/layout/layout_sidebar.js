Template['layout_sidebar'].helpers({
  modules: () => (Root.modules),
  isRouteActive: route => (FlowRouter.getRouteName().includes(route))
});
