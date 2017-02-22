// @flow

import { Meteor } from 'meteor/meteor'

const deepValue = (obj, path) => {
  let newObj = obj
  for (let i = 0, newPath = path.split('.'), len = newPath.length; i < len; i++) {
    newObj = newObj[newPath[i]]
  }
  return newObj
}

const Build = {
  Settings: {
    get: (key: string) => {
      if (Meteor.settings && Meteor.settings.public) {
        return deepValue(Meteor.settings.public, key)
      }
      return undefined
    },
  },
}

export default Build
