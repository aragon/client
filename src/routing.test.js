import {
  getPath,
  getPreferencesSearch,
  parsePath,
  parsePreferences,
} from './routing'

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

describe('getPath()', () => {
  test('handles modes', () => {
    expect(getPath(locator({ name: 'onboarding', status: 'create' }))).toEqual(
      '/create'
    )

    expect(getPath(locator({ name: 'org', orgAddress: ADDRESS }))).toEqual(
      `/${ADDRESS}/`
    )

    // Home's route is /
    expect(
      getPath(locator({ name: 'org', orgAddress: ADDRESS, instanceId: 'home' }))
    ).toEqual(`/${ADDRESS}/`)

    expect(
      getPath(
        locator({ name: 'org', orgAddress: ADDRESS, instanceId: 'permissions' })
      )
    ).toEqual(`/${ADDRESS}/permissions/`)

    expect(
      getPath(
        locator({
          name: 'org',
          orgAddress: 'p.aragonid.eth',
          instanceId: ADDRESS,
        })
      )
    ).toEqual(`/p/${ADDRESS}/`)
  })

  test('handles org mode without address', () => {
    expect(getPath(locator({ name: 'org', instanceId: 'home' }))).toEqual('/')

    expect(
      getPath(
        locator({ name: 'org', instanceId: 'home' }, { section: 'network' })
      )
    ).toEqual('/?preferences=/network')
  })

  test('handles no mode', () => {
    expect(getPath()).toEqual('/')

    expect(getPath(locator())).toEqual('/')

    expect(getPath(locator(null, { section: 'network' }))).toEqual(
      '/?preferences=/network'
    )
  })

  test('handles preferences', () => {
    expect(
      getPath(
        locator(
          { name: 'onboarding', status: 'create' },
          { section: 'network' }
        )
      )
    ).toEqual('/create?preferences=/network')

    expect(
      getPath(
        locator({ name: 'org', orgAddress: ADDRESS }, { section: 'network' })
      )
    ).toEqual(`/${ADDRESS}/?preferences=/network`)
  })
})

describe('parsePath()', () => {
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

describe('getPreferencesSearch()', () => {
  const cases = [
    [
      'preferences object',
      { section: 'network', subsection: '', data: {} },
      '?preferences=/network',
    ],
    [
      'preferences object with subsection',
      { section: 'network', subsection: 'ethereum', data: {} },
      '?preferences=/network/ethereum',
    ],
    [
      'preferences object with labels',
      { section: 'network', subsection: '', data: { labels: 'testlabel' } },
      '?preferences=/network&labels=testlabel',
    ],
    [
      'preferences object with labels',
      { section: 'network', subsection: '', data: { labels: 'testlabel' } },
      '?preferences=/network&labels=testlabel',
    ],
    ['empty preferences object', { section: '', subsection: '', data: {} }, ''],
  ]

  test.each(cases)(
    'handles a %s',
    (_, preferences, expectedPreferencesString) => {
      expect(getPreferencesSearch(preferences)).toEqual(
        expectedPreferencesString
      )
    }
  )
})

describe('parsePreferences()', () => {
  const cases = [
    [
      'normal preferences',
      '?preferences=/network',
      {
        section: 'network',
        subsection: '',
        data: {},
      },
    ],
    [
      'preferences with subsection',
      '?preferences=/network/ethereum',
      {
        section: 'network',
        subsection: 'ethereum',
        data: {},
      },
    ],
    [
      'empty preferences',
      '?preferences',
      {
        section: '',
        subsection: '',
        data: {},
      },
    ],
    [
      'preferences with labels',
      '?preferences=/network&labels=testlabel',
      {
        section: 'network',
        subsection: '',
        data: { labels: 'testlabel' },
      },
    ],
  ]

  test.each(cases)(
    'handles a %s path',
    (_, preferencesString, expectedPreferences) => {
      expect(parsePreferences(preferencesString)).toEqual(expectedPreferences)
    }
  )

  test('ignores labels without preferences path', () => {
    expect(parsePreferences('?labels=testlabel')).toEqual({
      section: '',
      subsection: '',
      data: {},
    })
  })

  test('ignores other search keys', () => {
    expect(parsePreferences('?preferences=/network&otherKey=invalid')).toEqual({
      section: 'network',
      subsection: '',
      data: {},
    })
  })
})
