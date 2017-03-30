// @flow

class NotificationsListener {
  ev: Object
  title: string
  bodyFormatter: Function
  uriFormatter: Function
  callToAction: string
  predicate: Object
  uid: Function

  constructor(
  // TODO: What's event's type?
  _event: Object,
  _title: string = 'Notification',
  _bodyFormatter: Function = () => 'empty',
  _uriFormatter: Function = () => ((window.isElectron) ? '/home' : '#!/home'),
  _callToAction: string = '',
  _predicate: Object = {},
  _uniqueId: Function = () => null) {
    this.ev = _event
    this.title = _title
    this.bodyFormatter = _bodyFormatter
    this.uriFormatter = _uriFormatter
    this.callToAction = _callToAction
    this.predicate = _predicate
    this.uid = _uniqueId
  }
}

export default NotificationsListener
