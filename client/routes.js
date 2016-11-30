BlazeLayout.setRoot('body')

renderView = (name) => {
  return (params, queryParams) => {
    BlazeLayout.render('layout', {main: `${name}View`})
  }
}

routeObject = (routeName) => {
  return {name: routeName, action: renderView(routeName)}
}

let views = ['main', 'ownership']
for (let view of views)
  FlowRouter.route(`/${view}`, routeObject(view))

FlowRouter.notFound = {
  action: () => { FlowRouter.go('main') }
}
