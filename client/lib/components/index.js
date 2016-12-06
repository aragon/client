Template.prototype.extend = function (components = []) {
  for (const c of components) {
    c.extend(this)
  }

  this.onCreated(() => {
    const ins = Template.instance()

    // ins.emit = (e, params = {}) => ($(ins.findAll('> *')).trigger(e, params))

    // ins.getVar = (key) => (TemplateVar.get(ins, key))

    // ins.setVar = (key, val) => (TemplateVar.set(ins, key, val))

    ins.parent = () => (ins.data.parent)
  })
  this.helpers({
    parent: () => ({ parent: Template.instance() }),
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
