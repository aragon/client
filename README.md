*Please submit issues in our centralized [issue tracker](../../../issues/issues)*

*No source code in this repo yet, download the [alpha release](../../releases)*

<img src="https://github.com/aragonone/issues/blob/master/logo.png" width="75%"/>

# The changelog

### Alpha 0.3 (March 30th, 2017)

- New feature: **BYOT** (*Bring your own token*), allow using Aragon with any `ERC20` token as a **governance token** for companies. Ability to wrap and unwrap tokens in votings and ownership entity.
- New feature: Add two new bylaws, **specific address only** and **ask oracle contract for confirmation**. Stepping stone for more dynamic bylaws.
- Major: Big internal refactor to voting logic, allows delegate voting (no UI yet).
- Major: Added *Add stock class* view for easily adding new stock to company. Also new *View stock classes* view to see all company stock types in detail.
- Major: UI improvements. New icons and action menus to avoid cluttering the top bars.
- Major: Aragon can now be used from any Ethereum web3 compatible browser (Mist, Parity or Metamask) without the native clients. [Try now!](https://alpha.aragon.one)

- Improvement: Voting UI, added option to modify or remove a vote, automatically execute voting option and relative/absolute voting counts.
- Support account changes in Metamask, useful for testing different roles in company.
- Added *token identity provider* that will do a reverse lookup for tokens and display its details in entity views.
- Improved action performing buttons and dialogs, disabled when user is not allowed to perform an action.
- Added a button to clear all notifications.
- Solves the infamous 'number' bug https://github.com/AragonOne/issues/issues/12

### Alpha 0.2.1 (Private: March 14th, 2017, public: March 20th, 2017)

- Major: Move all signing to 'personal_sign'
- Major: New notifications UI.
- Bypassed bug that make app get stuck on startup in Windows and Linux (Thanks @hueso, @batman and @albertoelias for helping debug it) https://github.com/AragonOne/issues/issues/12
- Add send test ether button to Metamask and send test ether when balance is lower than 0.5 ETH
- Improve flow for creating stock sales.
- Change metamask confirm tx buttons copy https://github.com/AragonOne/issues/issues/9
- Add more info when creating organization https://github.com/AragonOne/issues/issues/4
- Guide user when Keybase isn't opened or installed https://github.com/AragonOne/issues/issues/10
- Renamed 'God' role to 'Superuser' https://github.com/AragonOne/issues/issues/5
- Kickstart changelog. Very meta.

### Alpha 0.2 (Private: March 9th, 2017)

- Aragon now runs on the new **Kovan testnet**. You will notice the improve in speed and responsiveness!
- New **UI styling**. Followed the advice of our designer to make the app look cleaner.
- **Linux** and **Windows** support, in addition to macOS. Aragon is really multiplatform now.
- Tons of bug fixes and annoyances have been solved.

### Alpha 0.1

- Initial alpha release
