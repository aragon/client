// @flow
import { _ } from 'meteor/underscore'
import { Blaze } from 'meteor/blaze'
import { Template } from 'meteor/templating'
import { FlowRouter } from 'meteor/kadira:flow-router'

function moduleName(tmpl) {
  return tmpl.viewName.split('.')[1].split('_')[1].toLowerCase()
}

function removeGenericRoutes(module) {
  for (const route of FlowRouter._routes) {
    if (route.path === `/${module}/*`) {
      route.path = route.pathDef = `/${module}`
      FlowRouter._routesMap[route.name].path = `/${module}`
      FlowRouter._routesMap[route.name].pathDef = `/${module}`
    }
  }
}

function removeSubRoutes(module) {
  FlowRouter._routes = FlowRouter._routes.filter((route) => {
    if (route.path.startsWith(`/${module}/`)) {
      delete FlowRouter._routesMap[route.name]
      return false
    }
    return true
  })
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

    removeGenericRoutes(moduleName(this))
    addRoutes(this, this.routesObj)
  })

  this.onRendered(() => {
    if (!_.isEmpty(this.routesObj)) {
      FlowRouter.reload()

      Template.instance().autorun(() => {
        FlowRouter.watchPathChange()
        const path = FlowRouter.current().route.path
        let leanPath = path.replace(RegExp(`^(/${moduleName(this)})`), '')
        if (leanPath === '') leanPath = '/'
        if (this.routesObj[leanPath]) this.routesObj[leanPath].call(this, FlowRouter.current())
      })
    } else {
      Template.instance().autorun(() => {
        FlowRouter.watchPathChange()
        console.log('Path changed, firing created callbacks')
        Blaze._fireCallbacks(Template.instance().view, 'created')
      })
    }
  })

  this.onDestroyed(() => {
    const module = moduleName(this)
    if (FlowRouter.current().path.startsWith(`/${module}`)) return

    removeSubRoutes(module)
    FlowRouter.route(`/${module}/*`, {
      name: `${module}/*`,
      action: () => (FlowRouter._routesMap[module]._action()),
    })
    FlowRouter.reload()
  })

  return this
}

Template.prototype.routes = function (routes: Array) {
  Object.assign(this.routesObj, routes)
}

Blaze.TemplateInstance.prototype.parent = function (levels): Blaze.TemplateInstance {
  let view = this.view
  let ls = (typeof levels === 'undefined') ? 1 : levels
  while (view) {
    if (view.name.substring(0, 9) === 'Template.' && !(ls--)) {
      return view.templateInstance
    }
    view = view.parentView
  }
  return {}
}
