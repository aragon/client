// @flow
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'

import Root from '/client/root'

Template.Layout_Sidebar.helpers({
  modules: () => Root.modules.filter(m => m.sidebarItem),
  isRouteActive: route => FlowRouter.getRouteName().includes(route),
})
