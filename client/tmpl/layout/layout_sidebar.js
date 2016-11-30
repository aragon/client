Template['layout_sidebar'].helpers({
  modules: () => { return Root.modules },

  isActive: (itemName) => {
    return FlowRouter.getRouteName().includes(itemName) ? 'active' : null;
  }
});
