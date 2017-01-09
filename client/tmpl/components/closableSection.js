export default class ClosableSection {
  static extend(tmpl) {
    tmpl.events({
      'click #closeSectionButton': () => history.back(), // (instance.$('> *').trigger('close')),
    })
  }
}
