class NotificationsListener {
  constructor(_event, _title = 'Notification', _bodyFormatter = () => 'empty', _uriFormatter = () => '/home', _callToAction = null, _predicate = {}, _uniqueId = () => null) {
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
