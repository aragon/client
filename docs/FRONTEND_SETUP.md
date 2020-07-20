# Setting up your development environment

This guide is directed at frontend contributions to the Aragon codebase. It describes a simple workflow to contribute to aragonUI, the Aragon client, or the `aragon-apps`. For a more general guide about contributing, see [CONTRIBUTING.md](../CONTRIBUTING.md).

## Developing aragonUI

The simplest way to develop a component independently is by using the `devbox/` project. It is a simple React app that runs components in a way that is useful for development. These demos can be found in its `devbox/apps/` directory. To get it ready:

Install the aragonUI dependencies, link it, and start building it:

```
git clone git@github.com:aragon/aragon-ui.git
cd aragon-ui
yarn install
yarn link
yarn dev
```

Note: `yarn dev` is like `yarn build`, but it rebuilds automtically when a file changes.

Install the devbox dependencies, link `@aragon/ui` to it, and start it:

```
cd devbox
yarn install
yarn link @aragon/ui
yarn start
```

Note: linking `@aragon/ui` is not really needed with `npm` since we are declaring its version using  the [file protocol](https://github.com/aragon/aragon-ui/blob/8c60dffcd279e9ba640d91b3e7ce1a5d88b0ae64/devbox/package.json#L13) in the dependencies which creates a Unix link, but `yarn` has a different behavior and copies the parent directory, which prevents live updates.

To add a new demo, add a new file to `devbox/apps` and restart the server. The demo will appear on http://localhost:1234/.

## Developing the Aragon client

Install it:

```
git clone git@github.com:aragon/aragon.git
cd aragon
yarn install
```

If a change only impacts the Aragon client, the easiest is to run it connected to rinkeby, and create a testing organization. It requires an internet connection, but it doesn’t require to setup anything else (local Ethereum / IPFS nodes).

Run it:

```
yarn start:rinkeby
```

The development server is now running on http://localhost:3000/, and file changes will trigger a rebuild and reload the page.

A few other commands are available to connect it to other networks:

```
yarn start:staging
yarn start:mainnet
yarn start:local # require a local node
```

If it requires the local version of aragonUI, link it:

```
yarn link @aragon/ui
```

By running the client this way, the apps themselves will be loaded from IPFS. We’ll see how to override this behavior to run the apps frontend locally in the next section.

## Developing the apps

Clone the apps:

```
git clone git@github.com:aragon/aragon-apps.git
```

The `apps/` directory contains the apps that are released. Non-released apps are in `future-apps/`.

Every app is following the structure of having an `app/` directory inside of it (e.g. `apps/token-manager/app`). This directory contains the web app only, while the parent folder (e.g. `apps/token-manager`) represents the full Aragon app. When developing the frontend, we usually only work in the `/app` directory.

Go to one of the apps, e.g. Token Manager:

```
cd aragon-apps/apps/token-manager/app
```

Install its dependencies and run it:

```
yarn install
yarn start
```

The development server is now running on http://localhost:3003/, and file changes will trigger a rebuild and reload the page.

Note: each app in the `aragon-apps` project is having its own port number, so it’s easy to run them at the same time.

If it requires the local version of aragonUI, link it:

```
yarn link @aragon/ui
```

Apps need to receive data from the client to run properly, and won’t work when being loaded directly. To run them in the Aragon client, run it by setting the `ARAGON_APP_LOCATOR` variable to `local`:

```
cd aragon
ARAGON_APP_LOCATOR=local yarn start:rinkeby
```

Aragon client knows the local ports of every app, so loading any organization and trying to access e.g. the Token Manager will load it from the version running locally.
