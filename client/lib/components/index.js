Template.prototype.extend = function (components = []) {
  for (const c of components) {
    c.extend(this)
  }
  this.onCreated(() => {
    const ins = Template.instance()
    ins.parent = () => (ins.data.parent)
  })
  this.helpers({
    parent: () => ({ parent: Template.instance() }),
    $contains: (a, b) => (!a || b.indexOf(a) !== -1),
  })
  return this
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
