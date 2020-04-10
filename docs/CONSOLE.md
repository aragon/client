# Power-user console

This guide is directed at power-users of the Aragon client that desire to take full advantage of the in-app console added with the [`0.8.6` release](https://twitter.com/AragonOneTeam/status/1208841798069694464).

The in-app console allows you to access functionality that may be difficult to access or exposed yet in the frontend.

## How to access it

- **If you do not have the console pinned:** Open the "Settings" selector from the top bar, go to "Help and Feedback", and then click the `console` link on the "Embedded console" section. If you would like to pin the app to the System Apps menu, you may do so by enabling the toggle. If not, as soon as you leave the console, it will disappear from the System Apps menu.

- **If you have the console activated:** Click the "Console" app in the System Apps menu.

## Usage

The console defines clickable commands which you can select to autofill the prompt. You can also type the commands yourself, and the console will change state accordingly. You can also use the up/down arrow keys to display the console history.

Documentation for each available command's arguments:

### exec

`exec` allows you to interact with the apps installed in your organization. When you click the command, or write `exec/` on the console, you will see the list of apps installed, along with their addresses. You can click the one you want to interact with, or write the address manually. The console will then prompt you to write the method you'd like to call on the app's smart contract, with this **exact** structure:

```
methodName(argument1, argument2, ...)
```

After this is done, you can hit the `enter` key, or click the enter button. This will execute the command, and will open the Signer Panel, or, if you do not have enough permissions to execute the command, display an error.

A full example of a command with `exec`, executing a `mint()` on the Tokens app:

```
exec/0x104ad299ed53c9f76e4e653d634fbfb038a98a3d/mint(0x5790dB5E4D9e868BB86F5280926b9838758234DD, 1000000000000000000)
```

### act

`act` allows you to execute actions from an installed Aragon Agent app in the client itself, without needing to install [Frame](http://frame.sh/) or [aragonCLI](https://hack.aragon.org/docs/cli-intro.html).

Using the `act` command is easy: select the command, and then select the Agent instance you would like to interact with. After this, the command requires two more inputs: the target address (the address of the Voting app you would like to interact with, for example), and the method you would like to call on that target. For these inputs, `act` expects this exact structure:

```
methodName(type1: arg1, type2, arg2...)
```
Note that `act` requires you to provide the type of each parameter, as it otherwise won't know how to encode the method call! After this is done, you can hit the enter key or click the enter button. As with `exec`, this will execute the command and open the Signer Panel for you to sign the transaction.

Here's a full example of a command with `act`:

```
act/0x77df6ca4cc96d16edc7858cfc00f70fdc98bb027/0xe96c9851773ec7adcb6a155c7d4acf19a4ede7ae/vote(uint256: 10, bool: true, bool: false)
```

The above command will select the Agent at `0x77df...b027`, interact with the Voting app at `0xe96c...e7ae` (installed on a different organization), and execute the method `vote(uint256 voteId, bool supports, bool executesIfDecided)`.

As a final optional parameter, the `act` command can receive the amount of ETH, in wei, to send with the transaction.

Here's an example of how to send 0.5 ETH to a contract using the Agent's own balances:

```
act/0x77df6ca4cc96d16edc7858cfc00f70fdc98bb027/0x03C125d6a3f73cb90381d2F23142b462803BdAA6/500000000000000000
```


## Jump into the code

The handlers for each command are defined [here](https://github.com/aragon/aragon/tree/master/src/apps/Console/handlers).
