import { parsePath } from './routing'
import { web3Providers } from './environment'

const ADDRESS = '0xc41e4c10b37d3397a99d4a90e7d85508a69a5c4c'

function locator(
  mode,
  preferences = { data: {}, section: '', subsection: '' }
) {
  return {
    mode,
    preferences,
  }
}

describe.only('parsePath()', () => {
  afterAll(() => {
    web3Providers.default.disconnect()
  })

  test('handles modes', () => {
    expect(parsePath('/')).toEqual(
      locator({ name: 'onboarding', status: 'welcome' })
    )

    expect(parsePath('/create')).toEqual(
      locator({
        name: 'onboarding',
        status: 'create',
      })
    )

    expect(parsePath('/open')).toEqual(
      locator({
        name: 'onboarding',
        status: 'open',
      })
    )

    expect(parsePath('/p')).toEqual(
      locator({
        name: 'org',
        orgAddress: 'p.aragonid.eth',
        instanceId: 'home',
        instancePath: '/',
      })
    )
  })

  test('handles org paths', () => {
    expect(parsePath(`/p/${ADDRESS}`)).toEqual(
      locator({
        name: 'org',
        orgAddress: 'p.aragonid.eth',
        instanceId: ADDRESS,
        instancePath: '/',
      })
    )
  })

  test('handles app paths', () => {
    expect(parsePath(`/p/${ADDRESS}/test`)).toEqual(
      locator({
        name: 'org',
        orgAddress: 'p.aragonid.eth',
        instanceId: ADDRESS,
        instancePath: '/test',
      })
    )
  })

  test('handles preferences paths', () => {
    expect(parsePath('/open', '?preferences=/network')).toEqual(
      locator(
        {
          name: 'onboarding',
          status: 'open',
        },
        { section: 'network', subsection: '', data: {} }
      )
    )
  })

  test('handles an app path with a preference path', () => {
    expect(parsePath(`/p/${ADDRESS}/test`, '?preferences=/network')).toEqual(
      locator(
        {
          name: 'org',
          orgAddress: 'p.aragonid.eth',
          instanceId: ADDRESS,
          instancePath: '/test',
        },
        { section: 'network', subsection: '', data: {} }
      )
    )
  })

  test('handles malformed paths', () => {
    expect(parsePath(`/p/${ADDRESS}///`)).toEqual(
      locator({
        name: 'org',
        orgAddress: 'p.aragonid.eth',
        instanceId: ADDRESS,
        instancePath: '///',
      })
    )
  })
})
