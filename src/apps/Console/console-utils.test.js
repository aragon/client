import {
  buildCommand,
  parseMethodCall,
  parseCommand,
  parseInitParams,
  parsePermissions,
} from './console-utils'

describe('Build command tests', () => {
  test('Builds from empty strings', () => {
    expect(buildCommand('', 'command')).toEqual('command/')
  })

  test('Builds from existing tokens', () => {
    expect(buildCommand('command/first/', 'second')).toEqual(
      'command/first/second/'
    )
  })

  test('Eliminates dangling characters from last token', () => {
    expect(buildCommand('command/incomple', 'first')).toEqual('command/first/')
  })

  test('Errors out on wrong types', () => {
    expect(() => buildCommand(null, 'first')).toThrow('wrong type')
    expect(() => buildCommand('command/', null)).toThrow('wrong type')
  })
})

describe('Parse command tests', () => {
  test('Handles empty strings', () => {
    expect(parseCommand('')).toEqual([''])
  })

  test('handles arbitrary commands', () => {
    expect(parseCommand('install/agent/()/ROLE:1:2')).toEqual([
      'install',
      'agent',
      '()',
      'ROLE:1:2',
    ])

    expect(parseCommand('exec/tokens/mint/(0x,1)')).toEqual([
      'exec',
      'tokens',
      'mint',
      '(0x,1)',
    ])
  })

  test('Errors out on wrong types', () => {
    expect(() => parseCommand(null)).toThrow('wrong type')
  })
})

describe('parseMethodCall tests', () => {
  test('Handles method calls without arguments', () => {
    expect(parseMethodCall('vote()')).toEqual(['vote'])
    expect(parseMethodCall('vote(uint256,bool,bool)')).toEqual([
      'vote',
      ['uint256', 'bool', 'bool'],
    ])
    expect(parseMethodCall('vote(uint256, int, bool)')).toEqual([
      'vote',
      ['uint256', 'int', 'bool'],
    ])
  })

  test('Handles method calls with arguments', () => {
    expect(
      parseMethodCall('vote(uint256: 7, bool: true, bool: false)')
    ).toEqual(['vote', ['uint256', 'bool', 'bool'], ['7', 'true', 'false']])
  })

  test('Errors out on wrong types', () => {
    expect(() => parseMethodCall(null)).toThrow('wrong type')
  })

  test('Errors out on malformed calls', () => {
    expect(() => parseMethodCall('')).toThrow('malformed')
    expect(() => parseMethodCall('  ')).toThrow('malformed')
    expect(() => parseMethodCall('y')).toThrow('malformed')
    expect(() => parseMethodCall('y(bool:true')).toThrow('malformed')
  })

  test('Throws on parameters and arguments mismatch', () => {
    expect(() =>
      parseMethodCall('vote(uint256:,bool: true,bool: false')
    ).toThrow('failed')
    expect(() => parseMethodCall('vote(uint256: 1, bool: , bool:)')).toThrow(
      'failed'
    )
  })
})

describe('parseInitParams tests', () => {
  test('Handles parsing correctly', () => {
    expect(parseInitParams('(0x,true,1)')).toEqual(['0x', 'true', '1'])
    expect(parseInitParams('(0x)')).toEqual(['0x'])
    expect(parseInitParams('()')).toEqual([])
  })

  test('Errors out on wrong types', () => {
    expect(() => parseInitParams(null)).toThrow('wrong type')
  })

  test('Errors out on malformed calls', () => {
    expect(() => parseInitParams('0x(5,3)')).toThrow('malformed')
    expect(() => parseInitParams('0x,1,false)')).toThrow('malformed')
  })

  test('Throws on dangling commands or skipped params', () => {
    expect(() => parseInitParams('(,,100)')).toThrow('skipped')
    expect(() => parseInitParams('( , , , true)')).toThrow('skipped')
    expect(() => parseInitParams('(, , true, )')).toThrow('skipped')
  })
})

describe('parsePermissions tests', () => {
  test('Handles parsing correctly', () => {
    expect(parsePermissions('TRANSFER_ROLE:0x:0x')).toEqual([
      ['TRANSFER_ROLE', '0x', '0x'],
    ])
    expect(parsePermissions('TRANSFER_ROLE:0x:0x,VOTE_ROLE:0x:0x')).toEqual([
      ['TRANSFER_ROLE', '0x', '0x'],
      ['VOTE_ROLE', '0x', '0x'],
    ])
    expect(
      parsePermissions('EXECUTE_ACTIONS_ROLE:0x:0x, VOTE_ROLE:0x:0x')
    ).toEqual([
      ['EXECUTE_ACTIONS_ROLE', '0x', '0x'],
      ['VOTE_ROLE', '0x', '0x'],
    ])
  })

  test('Errors out on wrong types', () => {
    expect(() => parsePermissions(null)).toThrow('wrong type')
  })

  test('Errors out on malformed calls', () => {
    expect(() => parsePermissions('0x:1')).toThrow('malformed')
    expect(() => parsePermissions('0x')).toThrow('malformed')
    expect(() => parsePermissions('0x,0x:1:2')).toThrow('malformed')
  })
})
