import Helpers from './helpers'

function moduleName(tmpl) {
  return tmpl.viewName.split('.')[1].split('_')[1].toLowerCase()
}

function removeRoutes(module) {
  for (const route of FlowRouter._routes) {
    if (route.path === `/${module}/*`) {
      route.path = route.pathDef = `/${module}`
      FlowRouter._routesMap[route.name].path = `/${module}`
      FlowRouter._routesMap[route.name].pathDef = `/${module}`
    }
  }
}

function addRoutes(tmpl, routes) {
  const module = moduleName(tmpl)
  for (const path of Object.keys(routes)) {
    FlowRouter.route(`/${module}${path}`, {
      name: `${module}${path}`,
      action: () => {},
    })
  }
}

Template.prototype.extend = function (components = []) {
  this.routesObj = {}

  for (const c of components) {
    c.extend(this)
  }
  this.onCreated(() => {
    const ins = Template.instance()
    ins.parent = () => (ins.data.parent)

    removeRoutes(moduleName(this))
    addRoutes(this, this.routesObj)
  })

  this.onRendered(() => {
    if (!_.isEmpty(this.routesObj)) {
      FlowRouter.reload()

      Template.instance().autorun(() => {
        FlowRouter.watchPathChange()
        const path = FlowRouter.current().route.path
        let leanPath = path.replace(RegExp(`^(/${moduleName(this)})`), '')
        if (leanPath === '') {
          leanPath = '/'
        }
        if (this.routesObj[leanPath]) {
          this.routesObj[leanPath].call(this, FlowRouter.current())
        }
      })
    }
  })
  this.helpers(Helpers)
  return this
}

Template.prototype.routes = function (routes) {
  Object.assign(this.routesObj, routes)
}

Blaze.TemplateInstance.prototype.parent = function (levels) {
  let view = this.view
  if (typeof levels === 'undefined') {
    levels = 1
  }
  while (view) {
    if (view.name.substring(0, 9) === 'Template.' && !(levels--)) {
      return view.templateInstance
    }
    view = view.parentView
  }
}
