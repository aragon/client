class Module {
  constructor(name, icon = 'help', routeName, templateName, layout = 'layout') {
    this.name = name
    this.icon = icon
    this.routeName = routeName || name
    this.templateName = templateName || `module_${this.routeName}`
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
