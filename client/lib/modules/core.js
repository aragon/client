class Core {
  constructor(modules) {
    this.setup();

    this._modules = new ReactiveVar([]);
    if (modules)
      this.modules = modules;
  }

  get modules() {
    return this._modules.get();
  }

  set modules(newModules) {
    this._modules.set(newModules);
    this.setupRoutes();
  }

  setupRoutes(modules) {
    this.modules
      .map(module => (module.route))
      .forEach(route => FlowRouter.route(`/${route.name}`, route));
  }

  setup() {
    BlazeLayout.setRoot('body');
    FlowRouter.notFound = {
      action: () => FlowRouter.go('main')
    }
  }
}

export default Core;
