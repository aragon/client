// https://gist.github.com/sohkai/7b3385a08ca49ce39935d5b76bf8ef82

const disputableVotingApp = {
  active: true,
  appAddress: '0x4f82924c7bd4c0e3b5f0f19273e7f8cdcf5c5609', // this will allow you to find more details from the `apps()` observable
  collateralToken: {
    address: '0x3AF6b2f907F0c55F279e0ED65751984E6cdC4a42',
    decimals: 18,
    name: 'DAI Token',
    symbol: 'DAI',
  },
  actionAmount: '100000000000000000000',
  challengeAmount: '200000000000000000000',
  challengeDuration: 172800000,
}

const signature = {
  versionId: '1',
  date: 1594076738116,
  transaction:
    '0x3f175da3d499fa6be0c4f4b73eebdde8386dfbd64ae5f858c53f667f1405a959',
}

const signer = {
  lastSignedVersionId: '1',
  signatures: [signature],
}

const version = {
  id: '1',
  title: 'Test Agreement',
  content: 'ipfs:Qmb5CHbQQQx6YXkPE6HodeXVmtCRgpSgkj9EkW9xs6jDHj', // decoded URI for content, usually in the form of 'ipfs:...'
  arbitrator: '0x06a3FA06F9Bfa8d945C367D183d1562bCe0500DB',
  aragonAppFeesCashier: '0x45C8e37ef5bB4C6681351282D7d0CedA58BB7EB0',
  effectiveFrom: 1594076738116,
}

const agreement = {
  appAddress: '0x5c6620c49f9aecf74bd483054f2d0ace0d375f96',
  connectedApps: [disputableVotingApp],
  currentVersion: version,
  signers: {
    '0x0090aed150056316e37fe6dfa10dc63e79d173b6': signer,
  },
  stakingPool: '0x190B8fed21E1Efd6515E4cC9B3D07eF44Af81865',
  versions: [version],
}

export const MOCK_AGREEMENT_DOC = `
# App Mining Registry Agreement

THIS AGREEMENT is made and entered by and among the parties that fulfill the condition to
sign this agreement (collectively referred to as the “App Publishers” and individually as the “App
Publisher”) and is effective as of the date of the signing (the “Effective Date”)

## Background

1. The App Mining Program is a program promoted by the Aragon Association with the goal
of rewarding developers for creating and maintaining Aragon apps. In order to be
considered a participant of the App Mining Program, App Publishers shall have at least
one of the apps they have developed duly registered in the App Mining Registry.
2. This Agreement establishes the application process App Publishers need to follow to
apply for registration of their apps in the App Mining Registry as well as the
decision-making process for the acceptance or not of such registration.
3. The App Mining registry will be managed through the App Mining Organization (the
“Organization”) leveraging Aragon Court and the Apiary explorer. The Organization is
built on aragonOS and exists as a set of smart contracts that define the Organization’s
stakeholders and their associated rights and obligations. Some of the Organization’s
stakeholders’ rights and obligations require subjective constraints that cannot be
encoded directly in a smart contract. Therefore, the App Publishers accept and agree to
be bound by the following rules.
The App Publishers, acknowledging the capacities in which they act, and with the necessary
powers to represent themselves, enter into the present agreement, in accordance with the
following:

## Clauses

### 1. Purpose of the App Mining Organization

The purpose of the Organization is to manage the registry of the eligible Aragon apps (the
“Registry”) that will be part of the App Mining program and will be considered for rewards. The
Organization is composed of two apps: (i) the Address Book app and (ii) the Delay app.

### 2. Eligibility criteria

Applications should meet certain basic criteria to be eligible for App Mining rewards. The criteria
ensures the apps are broadly useful and composable building blocks for DAOs and not custom
components built to service only a single user's needs.
The following are the eligibility criteria:

  - The app must be open source and with a license similar to the licenses that Aragon uses
  or any FOSS license of the Free Software Foundation or any open source license
  approved by the Open Source Initiative
  - The app must be an original work or a derivative work offering novel functionality
  - The app must not already exist on the Registry
  - The app must be useful as a standalone app or module that can be used as a
  composable building block for Aragon organizations
  - The app publisher must provide user documentation, including installation instructions

### 3. Submission Process

Participation in the App Mining Program is opt-in. To be considered a participant of the App
Mining Program, App Publishers shall have at least one registered app in the App Mining
Registry.
To register an app that you have developed in the App Mining Registry, App Publishers shall
apply for registration following the instructions established herein. You shall submit as many
applications as you want to be considered under the App Mining Program.
Before starting the application process, the App Publishers are required to have:

  - Access to an Ethereum account used to publish changes to the aragonPM repository
  associated with the app they are submitting
  - The Ethereum address of the aragonPM repository associated with the app they are
  submitting
  - An account on Aragon Forum
  To submit an application, App Publishers shall do so through the Address Book app of the
  Organization following these instructions:
  - Navigate to the Address Book app in the Organization and click “New Entity”, using the
  same Ethereum account that can publish updates to the app’s repository on aragonPM
  - Enter the (i) name of the app in the name field and the (ii) aragonPM repository address
  of the app in the address field. This information must match what can be found on the
  Apiary explorer
  - Create a new thread on the Aragon Forum titled “App Mining Submission: [App Name]”.
  In this thread the App Publishers must include any information they wish to present to
  the jurors of the Aragon Court, including links to Github and documentation they may
  consider relevant
  - Agree with the App Mining Program Terms & Conditions
  The administrative account controlling the Organization will pause the delayed action, after
  submission, while the relevant dispute is created and resolved in Aragon Court (see below).

### 4. Aragon Court

Aragon Court will be used to moderate the review and approval processes of the apps to be
accepted in the App Mining Registry.
An administrative account controlling the Organization will validate that the App Publisher has
agreed to this agreement and will create the relevant dispute using the information provided by
the App Publisher on the Aragon forum.
The final decision regarding the registration or not of the App Publisher’s app in the Registry
and therefore of the App Publisher participation in the App Mining Program will be subject to the
decision taken by the Aragon Court and it is outside of the Aragon Association’s control.
The Organization will only execute the decision taken by the Aragon Court. In specific, if the
Aragon Court ruling resolves in favor of the App Publisher, the delayed action will be unpaused,
allowing the relevant app to be added to the Registry. If the Aragon Court ruling resolves
against the App Publisher or if the ruling is “refuse to rule”, the action will be cancelled and the
app will not be added to the Registry.
The terms of use of the Aragon Court, including the details regarding its mechanisms, rules, and
proceedings are available here. The App Publisher accepts that the application for registration
will be treated in accordance with the terms of the Aragon Court to which the App Publisher is
bound. The App Publisher represents that he/she has read and understood the terms of use of
the Aragon Court.

### 5. Dispute Resolution

Any claims, disputes, and controversies arising out of this agreement shall be settled in the
Aragon Court following the dispute process established therein and in accordance with its
terms.
`

export const MOCK_AGREEMENTS = [agreement]
