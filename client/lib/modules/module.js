class Module {
  constructor(name, icon = 'help', sidebarItem = true, routeName, templateName, layout = 'Layout') {
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
