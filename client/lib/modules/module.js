class Module {
  constructor(name, icon, routeName, templateName, layout) {
    this.name = name
    this.icon = icon || 'help'
    this.routeName = routeName || name
    this.templateName = templateName || `module_${this.routeName}`
    this.layout = layout || 'layout'
  }

  get route() {
    return { name: this.routeName, action: () => this.renderView() }
  }

  renderView(/* params, queryParams */) {
    BlazeLayout.render(this.layout, { main: this.templateName })
  }
}

export default Module
