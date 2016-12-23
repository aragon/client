// @flow

export type Entity = {
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
