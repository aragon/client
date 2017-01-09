// @flow

class Core {
  constructor(modules = []) {
    Core.setup()

    this.modulesVar = new ReactiveVar([])
    this.modules = modules
  }

  get modules() {
    return this.modulesVar.get()
  }

  set modules(newModules) {
    this.modulesVar.set(newModules)
    this.setupRoutes()
  }

  setupRoutes() {
    this.modules
      .map(module => (module.route))
      .forEach((route) => {
        FlowRouter.route(`/${route.name}/*`, route)
        FlowRouter.route(`/${route.name}`, route)
      })
  }

  static setup() {
    BlazeLayout.setRoot('body')
    FlowRouter.notFound = {
      action: () => FlowRouter.go('home'),
    }
  }
}

export default Core
