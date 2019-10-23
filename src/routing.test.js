import { parsePath } from './routing'
import { APP_MODE_START, APP_MODE_SETUP, APP_MODE_ORG } from './symbols'

const ADDRESS = '0xc41e4c10b37d3397a99d4a90e7d85508a69a5c4c'

function locator(path, data) {
  return {
    path,
    pathname: path,
    preferences: { params: new Map(), path: '' },
    search: '',
    ...data,
  }
}

describe('parsePath()', () => {
  test('handles modes', () => {
    expect(parsePath('/')).toEqual(
      locator('/', {
        action: '',
        mode: APP_MODE_START,
      })
    )

    expect(parsePath('/create')).toEqual(
      locator('/create', {
        action: 'create',
        mode: APP_MODE_SETUP,
      })
    )

    expect(parsePath('/open')).toEqual(
      locator('/open', {
        action: 'open',
        mode: APP_MODE_START,
      })
    )

    expect(parsePath('/p')).toEqual(
      locator('/p', {
        mode: APP_MODE_ORG,
        dao: 'p.aragonid.eth',
        instanceId: 'home',
        instancePath: '/',
        params: null,
      })
    )
  })

  test('handles org paths', () => {
    expect(parsePath(`/p/${ADDRESS}`)).toEqual(
      locator(`/p/${ADDRESS}`, {
        dao: 'p.aragonid.eth',
        instanceId: ADDRESS,
        instancePath: '/',
        mode: APP_MODE_ORG,
        params: null,
      })
    )
  })

  test('handles app paths', () => {
    expect(parsePath(`/p/${ADDRESS}/test`)).toEqual(
      locator(`/p/${ADDRESS}/test`, {
        dao: 'p.aragonid.eth',
        instanceId: ADDRESS,
        instancePath: '/test',
        mode: APP_MODE_ORG,
        params: null,
      })
    )
  })

  test('handles preferences paths', () => {
    expect(parsePath('/open', '?preferences=/network')).toEqual(
      locator('/open', {
        action: 'open',
        mode: APP_MODE_START,
        path: '/open?preferences=/network',
        search: '?preferences=/network',
        preferences: { params: new Map(), path: 'network' },
      })
    )
  })

  test('handles malformed paths', () => {
    expect(parsePath(`/p/${ADDRESS}///`)).toEqual(
      locator(`/p/${ADDRESS}///`, {
        dao: 'p.aragonid.eth',
        instanceId: ADDRESS,
        instancePath: '///',
        mode: APP_MODE_ORG,
        params: null,
      })
    )
  })
})
