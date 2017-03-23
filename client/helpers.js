// @flow


import { moment } from 'meteor/momentjs:moment'
import { Template } from 'meteor/templating'
import { callToActionForAction, bylawDisclaimerForAction } from '/client/lib/action-dispatcher/helpers'

import { NotificationsManager } from '/client/lib/notifications'

const Notifications = NotificationsManager.Notifications

const helpers = {}

helpers.now = () => moment()
helpers.timeRange = (a, b) => {
  let timeDiff = moment(a).twix(b).humanizeLength()
  timeDiff = b <= new Date() ? `${timeDiff} ago` : timeDiff
  return timeDiff
}
// TODO: Some of this helpers are in raix:handlebar-helpers already
helpers.plus = (a: number, b: number): number => a + b
helpers.percentFormat = (x: number): string => `${Math.round(10000 * (x || 0)) / 100}%`
helpers.arrayAccess = (array: Array<any>, index: number) => array[index]
helpers.isNull = (x: any): boolean => x === null
helpers.isNotNull = (x: any): boolean => x !== null
helpers.count = (x: any): number => x.count()
helpers.isMe = (entity): boolean => entity.ethereumAddress === Entities.findOne({current: true}).ethereumAddress // can't use identity because of cyclic dep

helpers.callToActionForAction = callToActionForAction
helpers.bylawDisclaimerForAction = bylawDisclaimerForAction

helpers.unhandledNotifications = () => Notifications.find({ handled: false }).count()
helpers.ether = (x: number): string => parseFloat(web3.fromWei(x, 'ether')).toLocaleString()

helpers.networkName = (): string => Session.get('networkName')
helpers.etherscan = (txId: string): string => `https://${Session.get('etherscanSub')}etherscan.io/tx/${txId}`
helpers.etherscanAddress = (address: string): string => `https://${Session.get('etherscanSub')}etherscan.io/address/${address}`

Object.keys(helpers).forEach(k => Template.registerHelper(k, helpers[k]))

export default helpers
