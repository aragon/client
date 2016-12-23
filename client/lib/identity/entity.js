// @flow

export type Entity = {
  identityProvider: string,
  ethereumAddress: string,
  data: Object,
}

export type FormattedEntity = {
  identityProvider: string,
  ethereumAddress: string,
  username: string,
  name: string,
  picture: string,

  location?: string,
  bio?: string,
  pubkey?: {
    fingerprint: string,
    content: string,
  },
  cryptocurrencies?: {
    bitcoin?: string,
  },
  social?: {
    twitter: string,
    facebook: string,
    github: string,
  },
}
