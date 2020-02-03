# Power-user console

This guide is directed at Power-users of the aragon client that desire to take full advantage of the in-app console added on `0.8.6`. This console lets user executes actions with their aragon agent app throught `act` and execute actions on their organizations with `exec`.

## How to access it

- **If you do not have the console activated:** Click the "Global Preferences" icon, go to "Help and Feedback", and click the `console` link on the "Embedded console" box. If you wish to permanently pin it to the System apps menu, do it by clicking the slider. If not, as soon as you leave the console, it will dissappear from the System Apps menu and also close the menu itself if it was not open before.

- **If you have the console activated:** Click the "Console" app.

## Usage

The console defines clickable commands which you can select to autofill the prompt. You can also type the commands yourself, and the console will change state accordingly. You can also use the up/down arrow keys to display the console history. Here is the user guide for each handler:

### exec

With exec, you can interact with the apps installed on your DAO if you ever need to do something that you would do from the CLI. When you click the command, or write `exec/` on the console, you will see the list of apps installed, along with their addresses. You can click the one you want to interact with, or write the address manually. After this is done, the console will prompt you to write the smart contract method of the app you want to call (you can see the standard app contracts in this [monorepo](https://github.com/aragon/aragon-apps)), with this **exact** structure:

```
methodName(argument1, argument2...)
```

After this is done, you can hit the `enter` key, or click the enter button. This will execute the command, and will open the Signer Panel, or, if you do not have enough permissions to execute the command, display an error. Here's a full example of a command with `exec`:

```
exec/0x104ad299ed53c9f76e4e653d634fbfb038a98a3d/mint(0x5790dB5E4D9e868BB86F5280926b9838758234DD, 1000000000000000000)
```

### act

Act allows you to use your aragon agent from the client itself, without needing to setup your local environment for the aragonCLI. This is very powerful, as you can now execute actions on your agent's behalf without leaving the client itself.

Using the `act` command is easy: select the command, and then select the agent instance you would
like to use. After this, the command needs two more things: the target address (the address of the voting app you would like to interact with, for example), and the method name you would like to call with this exact structure:

```
methodName(type1: arg1, type2, arg2...)
```

After this is done, you can hit the enter key or click the enter button. As with exec, this will
execute the command and open the Signer Panel for you to sign the transaction. Here's a full example
of a command with `act`:

```
act/0x77df6ca4cc96d16edc7858cfc00f70fdc98bb027/0xe96c9851773ec7adcb6a155c7d4acf19a4ede7ae/vote(uint256: 10, bool: true, bool: false)
```

This command will select the agent with address 0x77df6a..., interact with a voting app with address
of 0xe96c9..., and execute the method vote, on vote number 10, supporting the vote with `true`. Note that as of now, you cannot send ETH through the console with the agent.

## Jump into the code

The handlers for each command are defined [here](https://github.com/aragon/aragon/tree/master/src/apps/Console/handlers).
