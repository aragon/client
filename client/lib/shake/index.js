// @flow
import faker from 'faker'
import type { ShakeUser } from './user'

const authToken = '7396fcac-0ab4-4475-852e-0f1963ee356b'

const shakeUrl = (action): string => `https://backend.qa.shakepay.co/api/${action}?key=${authToken}`

const postJSON = (action, data) => (
  fetch(shakeUrl(action), {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  })
)

type ShakeInvoice = {
  email: string,
  currency: string,
  amount: number,
}

export default class Shake {
  static fakeUser(): ShakeUser {
    return {
      user: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        dateOfBirth: faker.date.past(),
        phoneNumber: faker.phone.phoneNumber(),
        email: faker.internet.email(),
      },
      address: {
        address1: faker.address.streetAddress(),
        city: faker.address.city(),
        zipCode: faker.address.zipCode(),
        country: faker.address.country(),
      },
      card: {
        currency: 'USD',
        type: 'virtual',
      },
    }
  }

  static async createUser(userData: ShakeUser) {
    const res = await postJSON('users', userData)
    console.log(res)
  }

  static async createInvoice(invoiceData: ShakeInvoice) {
    const res = await postJSON('invoices', invoiceData)
    console.log(res)
  }
}
