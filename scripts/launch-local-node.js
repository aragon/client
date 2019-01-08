#!/usr/bin/env node

const ps = require('ps-node')
const execute = require('child_process').execSync

const DEFAULT_LOCAL_ENS_ADDRESS = '0x5f6F7E8cc7346a11ca2dEf8f827b7a0b612c56a1'
const DEFAULT_LOCAL_IPFS_GATEWAY = 'http://localhost:8080/ipfs'

var consoleOutput = function () {};

// Determine if quiet mode enabled
var quietMode = process.argv.includes('-q') || process.argv.includes('-Q');

// If not quiet mode, assign console.log to wrapper function
if (!quietMode) consoleOutput = console.log;

consoleOutput('Running aragon/aragon on local environment settings...\n');

// Set up defaults for development environment
process.env.REACT_APP_ETH_NETWORK_TYPE = 'local';

// Default REACT_APP_ENS_REGISTRY_ADDRESS if not set
if (!process.env.REACT_APP_ENS_REGISTRY_ADDRESS) {
  process.env.REACT_APP_ENS_REGISTRY_ADDRESS = DEFAULT_LOCAL_ENS_ADDRESS;
  consoleOutput(`ENS Registry address not specified, defaulting to AraGen's default deployment (${DEFAULT_LOCAL_ENS_ADDRESS}).\n`);
  consoleOutput("Warning: if you are not using AraGen, restart this command with REACT_APP_ENS_REGISTRY_ADDRESS exported to your locally deployed ENS Registry's address.\n");
}

// Test if ipfs is running locally and use it if so
ps.lookup(
  { command: 'ipfs' },
  function (err, resultList) {
    if (err) {
      throw new Error(err);
    }

    if (resultList.length > 0) {
      process.env.REACT_APP_IPFS_GATEWAY = DEFAULT_LOCAL_IPFS_GATEWAY;
      consoleOutput('Found a local IPFS daemon running...\n');
      consoleOutput(`The app will be configured to connect and serve assets from the default gateway (${DEFAULT_LOCAL_IPFS_GATEWAY}).\n`);
      // If no asset bridge is defined, default to using IPFS as the bridge
      if (!process.env.REACT_APP_ASSET_BRIDGE) {
        process.env.REACT_APP_ASSET_BRIDGE = 'ipfs';
        consoleOutput('Also defaulting the asset bridge to IPFS.\n');
      }
    } else {
      process.env.REACT_APP_ASSET_BRIDGE = 'local'
    }
  }
);

execute('npm start', [], { stdio: 'inherit' });
