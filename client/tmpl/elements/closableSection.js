class ClosableSection {
  static bind(tmpl, varName, newTmplName) {
    tmpl.events({
      'click .label.close': (e, temp) => {
        TemplateVar.set(temp.data.parent, varName, newTmplName)
      },
    })
  }
}

export default ClosableSection
