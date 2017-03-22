// @flow

import type { Entity } from '../entity'
import haiku from './haiku'
import identicon from '../helpers/identicon'

export default class Anon {
  static lookupEthAddress(addr: string): Object {
    return { ethereumAddress: addr }
  }

  static isCompany(address) {
    return address && localStorage.getItem('companyAddress') && address.toLowerCase() === localStorage.getItem('companyAddress').toLowerCase()
  }

  static isCompanyFactory(address) {
    return window.CompanyFactory.address === address
  }

  static isCompanyConfigurator(address) {
    return window.CompanyConfiguratorFactory.address === address
  }

  static format(entity: Entity) {
    let name = haiku(entity.ethereumAddress)
    if (this.isCompany(entity.ethereumAddress)) {
      name = 'Company'
    } else if (this.isCompanyFactory(entity.ethereumAddress)) {
      name = 'Company Factory'
    } else if (this.isCompanyConfigurator(entity.ethereumAddress)) {
      name = 'Company Configurator Factory'
    }

    return {
      username: entity.ethereumAddress,
      name,
      picture: identicon(entity.ethereumAddress),
    }
  }
}
