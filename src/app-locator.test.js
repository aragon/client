import appIds from './known-app-ids'
import { parseAppLocator } from './app-locator'

const CUSTOM_APP_1 =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
const CUSTOM_APP_2 =
  '0x0000000000000000000000000000000000000000000000000000000000000001'

test('all known apps local', () => {
  expect(parseAppLocator('local')).toEqual({
    [appIds['Voting']]: 'http://localhost:3001/',
    [appIds['Finance']]: 'http://localhost:3002/',
    [appIds['TokenManager']]: 'http://localhost:3003/',
    [appIds['Survey']]: 'http://localhost:3004/',
    [appIds['Agent']]: 'http://localhost:3005/',
    [appIds['Fundraising']]: 'http://localhost:3006/',
  })
})

test('one local app', () => {
  const result = {
    [appIds['Voting']]: 'http://localhost:3001/',
  }

  expect(parseAppLocator('Voting:local')).toEqual(result)
  expect(parseAppLocator('Voting:')).toEqual(result)
  expect(parseAppLocator('Voting')).toEqual(result)
  expect(parseAppLocator(',Voting,')).toEqual(result)
  expect(parseAppLocator(',Voting:,')).toEqual(result)
  expect(parseAppLocator(',Voting:local,')).toEqual(result)
  expect(parseAppLocator(',Voting:local,')).toEqual(result)
})

test('multiple local apps', () => {
  const result = {
    [appIds['Voting']]: 'http://localhost:3001/',
    [appIds['TokenManager']]: 'http://localhost:3003/',
  }

  expect(parseAppLocator('Voting:local,TokenManager')).toEqual(result)
  expect(parseAppLocator('Voting,TokenManager:,')).toEqual(result)
})

test('local port', () => {
  expect(parseAppLocator('Voting:1234,TokenManager:3333')).toEqual({
    [appIds['Voting']]: 'http://localhost:1234/',
    [appIds['TokenManager']]: 'http://localhost:3333/',
  })
})

test('custom app', () => {
  const result = {
    [CUSTOM_APP_1]: 'http://example.org/',
    [CUSTOM_APP_2]: 'http://example.org:4444/',
  }

  expect(
    parseAppLocator(
      `${CUSTOM_APP_1}:http://example.org/` +
        `,${CUSTOM_APP_2}:http://example.org:4444/`
    )
  ).toEqual(result)
})

test('mixed apps', () => {
  const result = {
    [appIds['Voting']]: 'http://localhost:3001/',
    [appIds['TokenManager']]: 'http://example.com/',
    [CUSTOM_APP_1]: 'http://example.org/',
  }

  expect(
    parseAppLocator(
      `Voting:local,TokenManager:http://example.com/,${CUSTOM_APP_1}:http://example.org/`
    )
  ).toEqual(result)
})

test('domain', () => {
  const result = {
    [appIds['Voting']]: 'http://localhost/',
    [appIds['Finance']]: 'http://finance.local/app',
    [appIds['TokenManager']]: 'http://token-manager/',
    [appIds['Fundraising']]: 'http://localhost:3333/',
  }

  expect(
    parseAppLocator(
      'Voting:localhost,Finance:finance.local/app,TokenManager:token-manager,Fundraising:localhost:3333'
    )
  ).toEqual(result)
})

test('IP', () => {
  const result = {
    [appIds['Voting']]: 'http://1.2.3.4/',
    [appIds['Finance']]: 'http://1.2.3.4:3423/app',
  }

  expect(parseAppLocator('Voting:1.2.3.4,Finance:1.2.3.4:3423/app')).toEqual(
    result
  )
})

test('ENS IDs', () => {
  const result = {
    [appIds['Voting']]: 'http://localhost:3001/',
    [appIds['Finance']]: 'http://localhost:3333/',
  }

  expect(
    parseAppLocator('voting.aragonpm.eth,finance.aragonpm.eth:3333')
  ).toEqual(result)
})
