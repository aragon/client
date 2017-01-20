// @flow

export type Entity = {
  identityProvider: string,
  ethereumAddress: string,
  status: number,
  data: Object,

  current?: boolean,
  _id?: string,
}

export type FormattedEntity = {
  identityProvider: string,
  ethereumAddress: string,
  status: string,
  username: string,
  name: string,
  picture: string,

  current?: boolean,
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
