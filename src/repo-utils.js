const KNOWN_REPOS = new Set([
  '0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae',
  '0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f',
  '0x7e852e0fcfce6551c13800f1e7476f982525c2b5277ba14b24339c68416336d1',
  '0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4',
])

export function isKnownRepo(appId) {
  return KNOWN_REPOS.has(appId)
}
