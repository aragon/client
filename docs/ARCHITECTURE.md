# Architecture Guide for the Aragon Client

> If you'd like to listen to a talk instead, you may be interested in checking out [`@sohkai's` technical overview](https://www.youtube.com/watch?v=jFjWjkhLPZ8)

> For a gentler walkthrough, [`@aquigorka`](https://github.com/aquigorka) published an [Aragon frontend walkthrough](https://blog.aragon.one/aragon-frontend-walkthrough/)

## Overview

The Aragon client (this repo, `aragon/aragon`) is built as a secure _shell_ that allows a user to create, launch, and manage a decentralized organization. It is meant to be the entry point for users into their decentralized organizations.

Similar to an operating system, users are able to install _applications_ into their organizations, and these _applications_ are securely lauched by the Aragon client in their own sandboxed environments.

In short, some important pieces of the architecture to know about:

- Organizations and their applications are built on top of the [aragonOS smart contract framework](https://github.com/aragon/aragonOS)
- Most organizations will be created through an Aragon Template, usually one from [`aragon/dao-templates`](https://github.com/aragon/dao-templates)
- Most organizations will have the applications in [`aragon/aragon-apps`](https://github.com/aragon/aragon-apps) installed by default
- Each application is composed of a smart contract and a UI frontend, connected through [aragonAPI](https://github.com/aragon/aragon.js/tree/master/packages/aragon-api)
- On-chain state from Ethereum is reduced in the Aragon client through [`@aragon/wrapper`](https://github.com/aragon/aragon.js/tree/master/packages/aragon-wrapper), which acts as a Web3 middleware layer
- Application sandboxing is provided through [iframes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) and [WebWorkers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) that are launched by the Aragon client
- Generic UI components are imported from [aragonUI](https://github.com/aragon/ui)

Some more documentation about these particular areas are available in the [Developer Portal](https://hack.aragon.org/):

- [`aragonOS`](https://hack.aragon.org/docs/aragonos-intro.html)
- [`aragonAPI`](https://hack.aragon.org/docs/aragonjs-intro.html)
- [`aragonUI`](https://hack.aragon.org/docs/aragonui-intro.html)
- [Aragon Templates](https://hack.aragon.org/docs/templates-intro)

## Finding the right repository to contribute to

If you find an issue, or would like to add a feature, ask yourself these following questions:

- Is it related to the smart contracts?
	- Is it related to the sandboxed applications? **If yes**, make the changes in [`aragon/aragon-apps`](https://github.com/aragon/aragon-apps) or your own app's repo.
	- Is it related to one of the onboarding templates? **If yes**, you'll want to see if it's a template from [`aragon/dao-templates`](https://github.com/aragon/dao-templates).
	- **Else**, [aragonOS](https://github.com/aragon/aragonOS) is most likely the repo to look at.
- Is it in one of the sandboxed applications (e.g. Voting, Tokens, or Finance from [`aragon/aragon-apps`](https://github.com/aragon/aragon-apps))?
	- Make the changes there!
- Is it a generic UI component?
	- Would it mostly benefit Aragon-related developers? **If yes**, [aragonUI](https://github.com/aragon/ui) is the best place.
	- **Else**, add it into `aragon/aragon` 👍.
- Is there something wrong with how the client or one of the apps is talking to Ethereum?
	- [`@aragon/wrapper`](https://github.com/aragon/aragon.js/tree/master/packages/aragon-wrapper) is likely the culprit.
- Is there something you'd like an app to do, but can't?
	- More APIs likely need to be added to [`@aragon/api`](https://github.com/aragon/aragon.js/blob/master/packages/aragon-api) and [`@aragon/wrapper`](https://github.com/aragon/aragon.js/tree/master/packages/aragon-wrapper).
- Is a transaction description not being parsed correctly, or looking weird (e.g. from the Voting app)?
  - It's likely either a problem with the app's radspec strings itself, or the [radspec parser](https://github.com/aragon/radspec).
- **Else**
	- ✅ **This repo is probably the right one to work on!** If you're still not sure, please file an issue and ask us!

## Starting frontend development

Refer to the [frontend development setup](./FRONTEND_SETUP.md) to set up everything you need to start local development on the Client or an app in [`aragon/aragon-apps`](https://github.com/aragon/aragon-apps)!

## Your own Aragon app

If you're developing your own app, the [Developer Portal](https://hack.aragon.org/) and the [Your first Aragon app tutorial](https://hack.aragon.org/docs/tutorial) are the best places to start.

Afterwards, you may want to look over some of the existing apps' contracts in [`aragon/aragon-apps`](https://github.com/aragon/aragon-apps), or browse through the work of other developers in the [awesome-aragon list](https://github.com/lkngtn/awesome-aragon) (such as [Autark's Open Enterprise](https://github.com/AutarkLabs/planning-suite) or [Aragon Black's Fundraising](https://github.com/AragonBlack/fundraising)).
