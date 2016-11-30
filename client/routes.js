BlazeLayout.setRoot('body');

renderView = (name) => {
  return (params, queryParams) => {
    BlazeLayout.render('layout', {main: `${name}View`})
  }
}

routeObject = (routeName) => {
  return {name: routeName, action: renderView(routeName)}
}

FlowRouter.route('/main', routeObject('main'))
FlowRouter.route('/ownership', routeObject('ownership'))

FlowRouter.notFound = {
  action: () => { FlowRouter.go('main') }
}
