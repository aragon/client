import { parsePath } from './routing'
import { APP_MODE_START, APP_MODE_ORG } from './symbols'

const ADDRESS = '0xc41e4c10b37d3397a99d4a90e7d85508a69a5c4c'

function locator(path, data) {
  return {
    path,
    pathname: path,
    search: '',
    ...data,
  }
}

describe('parsePath()', () => {
  test('it does something', () => {
    let path

    path = '/'
    expect(parsePath(path)).toEqual(
      locator(path, {
        mode: APP_MODE_START,
      })
    )

    path = `/p/${ADDRESS}/test`
    expect(parsePath(path)).toEqual(
      locator(path, {
        dao: 'p.aragonid.eth',
        instanceId: ADDRESS,
        instancePath: '/test',
        mode: APP_MODE_ORG,
        params: null,
      })
    )

    path = `/p/${ADDRESS}`
    expect(parsePath(path)).toEqual(
      locator(path, {
        dao: 'p.aragonid.eth',
        instanceId: ADDRESS,
        instancePath: '/',
        mode: APP_MODE_ORG,
        params: null,
      })
    )

    path = `/p/${ADDRESS}///`
    expect(parsePath(path)).toEqual(
      locator(path, {
        dao: 'p.aragonid.eth',
        instanceId: ADDRESS,
        instancePath: '///',
        mode: APP_MODE_ORG,
        params: null,
      })
    )
  })
})
