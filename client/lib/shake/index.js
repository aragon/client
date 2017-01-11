// @flow
import faker from 'faker'
import type { ShakeUser } from './user'
import supportedCountries from './countries'

const authToken = '7396fcac-0ab4-4475-852e-0f1963ee356b'

const shakeUrl = (action): string => `https://backend.qa.shakepay.co/api/${action}?key=${authToken}`

const postJSON = async (action, data) => {
  const res = await fetch(shakeUrl(action), {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  })
  const json = await res.json()
  return json
}

type ShakeInvoice = {
  email: string,
  currency: string,
  amount: number,
}

export default class Shake {
  static fakeUser(currency: string): ShakeUser {
    return {
      user: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        dateOfBirth: faker.date.between('1950-01-01', '1999-01-01'),
        phoneNumber: faker.phone.phoneNumberFormat(2).replace(/-/g, ''),
        email: faker.internet.email().toLowerCase(),
      },
      address: {
        address1: faker.address.streetAddress(),
        address2: faker.address.secondaryAddress(),
        city: faker.address.city(),
        zipCode: faker.address.zipCode('#####'),
        country: supportedCountries[Math.floor(Math.random()*supportedCountries.length)],
      },
      card: {
        type: 'virtual',
        currency,
      },
    }
  }

  static async createUser(userData: ShakeUser): Object {
    return await postJSON('users', userData)
  }

  static async createInvoice(invoiceData: ShakeInvoice) {
    return await postJSON('invoices', invoiceData)
  }
}
