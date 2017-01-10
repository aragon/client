// @flow
import { Mongo } from 'meteor/mongo'
import { PersistentMinimongo } from 'meteor/frozeman:persistent-minimongo'

import Identity from '/client/lib/identity'

import defaults from './defaults'

const SettingsCollection = new Mongo.Collection('settings', { connection: null })
new PersistentMinimongo(SettingsCollection)

const doc = (): Object =>
  SettingsCollection.findOne({ ethereumAddress: Identity.current().ethereumAddress })

class Settings {
  static get(key: string): any {
    const obj: Object = doc() || {}
    return obj[key]
  }

  static set(key: string, value: any) {
    SettingsCollection.update(
      { ethereumAddress: Identity.current().ethereumAddress },
      { $set: { [key]: value } },
      { upsert: true }
    )
  }

  static remove(key: string) {
    SettingsCollection.update(
      { ethereumAddress: Identity.current().ethereumAddress },
      { $unset: { [key]: 1 } }
    )
  }
}

if (!doc()) {
  for (const key of Object.keys(defaults)) {
    Settings.set(key, defaults[key])
  }
}

export default Settings
