#!/usr/bin/env node

const ps = require('ps-node')
const execute = require('child_process').execSync

const DEFAULT_LOCAL_ENS_ADDRESS = '0x5f6F7E8cc7346a11ca2dEf8f827b7a0b612c56a1'
const DEFAULT_LOCAL_IPFS_GATEWAY = 'http://localhost:8080/ipfs'

console.log('Running aragon/aragon on local environment settings...\n\n');

// Set up defaults for development environment
process.env.REACT_APP_ETH_NETWORK_TYPE = 'local';

// Default REACT_APP_ENS_REGISTRY_ADDRESS if not set
if (!process.env.REACT_APP_ENS_REGISTRY_ADDRESS) {
  process.env.REACT_APP_ENS_REGISTRY_ADDRESS = DEFAULT_LOCAL_ENS_ADDRESS;
  console.log(`ENS Registry address not specified, defaulting to AraGen's default deployment (${DEFAULT_LOCAL_ENS_ADDRESS}).`);
  console.log("Warning: if you are not using AraGen, restart this command with REACT_APP_ENS_REGISTRY_ADDRESS exported to your locally deployed ENS Registry's address.\n\n");
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
      console.log('Found a local IPFS daemon running...');
      console.log(`The app will be configured to connect and serve assets from from the default gateway (${DEFAULT_LOCAL_IPFS_GATEWAY}).`);
      // If no asset bridge is defined, default to using IPFS as the bridge
      if (!process.env.REACT_APP_ASSET_BRIDGE) {
        process.env.REACT_APP_ASSET_BRIDGE = 'ipfs';
        console.log('Also defaulting the asset bridge to IPFS.\n\n');
      }
    } else {
      process.env.REACT_APP_ASSET_BRIDGE = 'local'
    }

    // Debug: list processes in console
    resultList.forEach(function (process) {
      if (process) {
        console.log('PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments);
      }
    });
  }
);

execute('npm start');
