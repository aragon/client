// @flow
import { BlazeLayout } from 'meteor/kadira:blaze-layout'

class Module {
  name: string
  icon: string
  sidebarItem: boolean
  routeName: string
  templateName: string
  layout: string

  constructor(
  name: string,
  icon: string = 'help',
  sidebarItem: boolean = true,
  routeName: string,
  templateName: string,
  layout: string = 'Layout') {
    this.name = name
    this.icon = icon
    this.sidebarItem = sidebarItem
    this.routeName = routeName || name.toLowerCase()
    this.templateName = templateName || `Module_${this.name}`
    this.layout = layout
  }

  get route() {
    return { name: this.routeName, action: () => this.renderView() }
  }

  renderView(/* params, queryParams */) {
    BlazeLayout.render(this.layout, { main: this.templateName })
  }
}

export default Module
