export default class ClosableSection {
  static extend(tmpl) {
    tmpl.events({
      'click .label.close': (e, instance) =>
        (instance.$('> *').trigger('close')),
    })
  }
}
