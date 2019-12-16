import { parseMethodCall, parseCommand } from './utils'

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
})

describe('parseMethodCall tests', () => {
  test('Errors out on malformed calls', () => {
    expect(() => parseMethodCall('')).toThrow('Malformed')
    expect(() => parseMethodCall('  ')).toThrow('Malformed')
    expect(() => parseMethodCall('y')).toThrow('Malformed')
    expect(() => parseMethodCall('y(bool:true')).toThrow('Malformed')
  })

  test('Handles method calls without arguments', () => {
    expect(parseMethodCall('vote()')).toEqual(['vote'])
    expect(parseMethodCall('vote(uint256,bool,bool)')).toEqual([
      'vote',
      ['uint256', 'bool', 'bool'],
    ])
  })
})
