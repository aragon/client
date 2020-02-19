import { parsePath } from './routing'
import { APP_MODE_START, APP_MODE_SETUP, APP_MODE_ORG } from './symbols'
import { web3Providers } from './environment'

const ADDRESS = '0xc41e4c10b37d3397a99d4a90e7d85508a69a5c4c'

function locator(data) {
  return {
    // Just for convenience, set `pathname` to `path` if `pathname` doesn’t exist.
    pathname: data.pathname === undefined ? data.path : data.pathname,
    preferences: { params: new Map(), path: '' },
    search: '',
    ...data,
  }
}

describe('parsePath()', () => {
  afterAll(() => {
    web3Providers.default.disconnect()
  })

  test('handles modes', () => {
    expect(parsePath('/')).toEqual(
      locator({
        path: '/',
        action: '',
        mode: APP_MODE_START,
      })
    )

    expect(parsePath('/create')).toEqual(
      locator({
        path: '/create',
        action: 'create',
        mode: APP_MODE_SETUP,
      })
    )

    expect(parsePath('/open')).toEqual(
      locator({
        path: '/open',
        action: 'open',
        mode: APP_MODE_START,
      })
    )

    expect(parsePath('/p')).toEqual(
      locator({
        path: '/p',
        mode: APP_MODE_ORG,
        dao: 'p.aragonid.eth',
        instanceId: 'home',
        instancePath: '/',
      })
    )
  })

  test('handles org paths', () => {
    expect(parsePath(`/p/${ADDRESS}`)).toEqual(
      locator({
        path: `/p/${ADDRESS}`,
        dao: 'p.aragonid.eth',
        instanceId: ADDRESS,
        instancePath: '/',
        mode: APP_MODE_ORG,
      })
    )
  })

  test('handles app paths', () => {
    expect(parsePath(`/p/${ADDRESS}/test`)).toEqual(
      locator({
        path: `/p/${ADDRESS}/test`,
        dao: 'p.aragonid.eth',
        instanceId: ADDRESS,
        instancePath: '/test',
        mode: APP_MODE_ORG,
      })
    )
  })

  test('handles preferences paths', () => {
    expect(parsePath('/open', '?preferences=/network')).toEqual(
      locator({
        path: '/open?preferences=/network',
        pathname: '/open',
        action: 'open',
        mode: APP_MODE_START,
        preferences: { params: new Map(), path: 'network' },
        search: '?preferences=/network',
      })
    )
  })

  test('handles an app path with a preference path', () => {
    expect(parsePath(`/p/${ADDRESS}/test`, '?preferences=/network')).toEqual(
      locator({
        path: `/p/${ADDRESS}/test?preferences=/network`,
        pathname: `/p/${ADDRESS}/test`,
        dao: 'p.aragonid.eth',
        instanceId: ADDRESS,
        instancePath: '/test',
        mode: APP_MODE_ORG,
        preferences: { params: new Map(), path: 'network' },
        search: '?preferences=/network',
      })
    )
  })

  test('handles malformed paths', () => {
    expect(parsePath(`/p/${ADDRESS}///`)).toEqual(
      locator({
        path: `/p/${ADDRESS}///`,
        dao: 'p.aragonid.eth',
        instanceId: ADDRESS,
        instancePath: '///',
        mode: APP_MODE_ORG,
      })
    )
  })
})
