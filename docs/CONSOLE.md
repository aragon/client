# Power-user console

This guide is directed at Power-users of the aragon client that desire to take full advantage of the in-app console added on `0.8.6`. This console lets user executes actions with their aragon agent app throught `act` and execute actions on their organizations with `exec`.

## How to access it

- **If you do not have the console activated:** Click the "Global Preferences" icon, go to "Help and Feedback", and click the `console` link on the "Embedded console" box. If you wish to permanently pin it to the System apps menu, do it by clicking the slider. If not, as soon as you leave the console, it will dissappear from the System Apps menu and also close the menu itself if it was not open before.

- **If you have the console activated:** Click the "Console" app.

## Usage

The console defines clickable commands which you can select to autofill the prompt. You can also type the commands yourself, and the console will change state accordingly. You can also use the up/down arrow keys to display the console history. Here is the user guide for each handler:

### exec

With exec, you can interact with the apps installed on your DAO if you ever need to do something that you would do from the CLI. When you click the command, or write `exec/` on the console, you will see the list of apps installed, along with their addresses. You can click the one you want to interact with, or write the address manually. After this is done, the console will prompt you to write the method you want to call in this form:

```
methodName(argument1, argument2...)
```

After this is done, you can hit the `enter` key, or click the enter button. This will execute the command, and will open the Menu Panel for signing, or, if you do not have enough permissions to execute the command, display an error. Here's a full example of a command with `exec`:

```
exec/0x104ad299ed53c9f76e4e653d634fbfb038a98a3d/mint(0x5790dB5E4D9e868BB86F5280926b9838758234DD, 1000000000000000000)
```

The handlers for each command are defined [here](https://github.com/aragon/aragon/tree/master/src/apps/Console/handlers).
