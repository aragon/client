// @flow

export type ShakeUser = {
  user: {
    firstName: string,
    lastName: string,
    dateOfBirth: string, // YYYY-MM-DD. Must be 18 years or older.
    // International format without spaces, dashes, plus signs, or periods (e.g. 15145551234)
    phoneNumber: string,
    email: string,
  },
  address: {
    // Alphanumeric string between 2 and 35 characters with these special characters @ , - ..
    address1: string,
    address2?: string,
    city: string, // Alphanumeric string at most 20 characters
    zipCode: string, // Alphanumeric string between 3 and 8 characters
    // Federal District, Province, or State. Alphanumeric string at most 20 characters
    fedDistrict?: string,
    country: string, // Must be in ISO 3166-1 Alpha-2 code, see https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes (e.g. Canada would be 'CA')
  },
  card: {
    currency: string, // Either 'USD' or 'EUR'
    type: string, // Either 'virtual' or 'physical'
  },
}
