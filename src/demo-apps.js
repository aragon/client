const rawApps = [
  {
    "proxyAddress": "0x98cab1922947726bB959252bD8D80ff6E100912E",
    "kernelAddress": "0x83C36cFA235eE2f06932936f6C02f8945f805E45",
    "appId": "0x251d159c3b49fd46534d055db13a7fc462dae234346cbecffa41c4d4898ad967",
    "codeAddress": "0x3591488dE05edd19870AF4021258226DEE394E96",
    "isForwarder": false
  },
  {
    "proxyAddress": "0x00C7accd66EF4dee11C26b736808Bc8021c73454",
    "kernelAddress": "0x83C36cFA235eE2f06932936f6C02f8945f805E45",
    "appId": "0xd8ab59c8daa1d3c1a68e4443151e4a34f969b490ad6eec66457988114d1e0794",
    "codeAddress": "0xf58fDbeB1b5B8CFadf10C3E444E42D6FD3064349",
    "isForwarder": false
  },
  {
    "proxyAddress": "0x46646ac7268aa04140f361046aEcF6Ad0410EC9b",
    "kernelAddress": "0x83C36cFA235eE2f06932936f6C02f8945f805E45",
    "appId": "0x9fa3927f639745e587912d4b0fea7ef9013bf93fb907d29faeab57417ba6e1d4",
    "codeAddress": "0x29D87425793ed582b0fa5e668dC5D0a2E8638961",
    "isForwarder": true,
    "name": "Voting",
    "description": "Create votes that execute actions on behalf of token holders.",
    "icons": [
      {
        "src": "images/icon.png",
        "sizes": "192x192"
      }
    ],
    "script": "/script.js",
    "start_url": "/index.html",
    "version": "1.0.20",
    "roles": [
      {
        "name": "Create new votes",
        "id": "CREATE_VOTES_ROLE",
        "params": [],
        "bytes": "0xe7dcd7275292e064d090fbc5f3bd7995be23b502c1fed5cd94cfddbbdcd32bbc"
      },
      {
        "name": "Modify quorum",
        "id": "MODIFY_QUORUM_ROLE",
        "params": [
          "New quorum",
          "Current quorum"
        ],
        "bytes": "0xad15e7261800b4bb73f1b69d3864565ffb1fd00cb93cf14fe48da8f1f2149f39"
      }
    ],
    "path": "contracts/Voting.sol",
    "abi": [
      {
        "constant": false,
        "inputs": [
          {
            "name": "_minAcceptQuorumPct",
            "type": "uint256"
          }
        ],
        "name": "changeMinAcceptQuorumPct",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x036e4220"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "MODIFY_QUORUM_ROLE",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x3c624c75"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_token",
            "type": "address"
          },
          {
            "name": "_supportRequiredPct",
            "type": "uint256"
          },
          {
            "name": "_minAcceptQuorumPct",
            "type": "uint256"
          },
          {
            "name": "_voteTime",
            "type": "uint64"
          }
        ],
        "name": "initialize",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x3ee31e70"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_voteId",
            "type": "uint256"
          },
          {
            "name": "_voter",
            "type": "address"
          }
        ],
        "name": "getVoterState",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x4b12311c"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_voteId",
            "type": "uint256"
          }
        ],
        "name": "getVote",
        "outputs": [
          {
            "name": "open",
            "type": "bool"
          },
          {
            "name": "executed",
            "type": "bool"
          },
          {
            "name": "creator",
            "type": "address"
          },
          {
            "name": "startDate",
            "type": "uint64"
          },
          {
            "name": "snapshotBlock",
            "type": "uint256"
          },
          {
            "name": "minAcceptQuorum",
            "type": "uint256"
          },
          {
            "name": "yea",
            "type": "uint256"
          },
          {
            "name": "nay",
            "type": "uint256"
          },
          {
            "name": "totalVoters",
            "type": "uint256"
          },
          {
            "name": "script",
            "type": "bytes"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x5a55c1f0"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "EVMSCRIPT_REGISTRY_APP_ID",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x60b1e057"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "appId",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x80afdea8"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getInitializationBlock",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x8b3dd749"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "EVMSCRIPT_REGISTRY_APP",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x9b3fdf4c"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_sender",
            "type": "address"
          },
          {
            "name": "_role",
            "type": "bytes32"
          },
          {
            "name": "params",
            "type": "uint256[]"
          }
        ],
        "name": "canPerform",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xa1658fad"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "voteTime",
        "outputs": [
          {
            "name": "",
            "type": "uint64"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xbcf93dd6"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "CREATE_VOTES_ROLE",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xbe2c64d4"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_voteId",
            "type": "uint256"
          }
        ],
        "name": "getVoteMetadata",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xc05218c6"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_sender",
            "type": "address"
          },
          {
            "name": "_evmCallScript",
            "type": "bytes"
          }
        ],
        "name": "canForward",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xc0774df3"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_voteId",
            "type": "uint256"
          }
        ],
        "name": "canExecute",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xcc63604a"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_voteId",
            "type": "uint256"
          },
          {
            "name": "_voter",
            "type": "address"
          }
        ],
        "name": "canVote",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xcdb2867b"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "kernel",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xd4aae0c4"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_executionScript",
            "type": "bytes"
          },
          {
            "name": "_metadata",
            "type": "string"
          }
        ],
        "name": "newVote",
        "outputs": [
          {
            "name": "voteId",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xd5db2c80"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_evmScript",
            "type": "bytes"
          }
        ],
        "name": "forward",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xd948d468"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "minAcceptQuorumPct",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xdc474b1a"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_voteId",
            "type": "uint256"
          },
          {
            "name": "_supports",
            "type": "bool"
          },
          {
            "name": "_executesIfDecided",
            "type": "bool"
          }
        ],
        "name": "vote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xdf133bca"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_script",
            "type": "bytes"
          }
        ],
        "name": "getExecutor",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xf92a79ff"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_voteId",
            "type": "uint256"
          }
        ],
        "name": "executeVote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xf98a4eca"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "supportRequiredPct",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xfad167ab"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "token",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xfc0c546a"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "PCT_BASE",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xfc157cb4"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "isForwarder",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function",
        "signature": "0xfd64eccb"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "voteId",
            "type": "uint256"
          }
        ],
        "name": "StartVote",
        "type": "event",
        "signature": "0x33c2d6285ba1442f7dd954820743aacec7468bc52e1671024b948f48f1322640"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "voteId",
            "type": "uint256"
          },
          {
            "indexed": true,
            "name": "voter",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "supports",
            "type": "bool"
          },
          {
            "indexed": false,
            "name": "stake",
            "type": "uint256"
          }
        ],
        "name": "CastVote",
        "type": "event",
        "signature": "0xb34ee265e3d4f5ec4e8b52d59b2a9be8fceca2f274ebc080d8fba797fea9391f"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "voteId",
            "type": "uint256"
          }
        ],
        "name": "ExecuteVote",
        "type": "event",
        "signature": "0xbf8e2b108bb7c980e08903a8a46527699d5e84905a082d56dacb4150725c8cab"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "minAcceptQuorumPct",
            "type": "uint256"
          }
        ],
        "name": "ChangeMinQuorum",
        "type": "event",
        "signature": "0x28bb663e324957c72fa46db87d8afa7591b1c293b2c7ad06e3574eace993ff6d"
      }
    ],
    "functions": [
      {
        "sig": "initialize()",
        "roles": [],
        "notice": "Initializes Voting app with `_token.symbol(): string` for governance, minimum support of `(_supportRequiredPct - _supportRequiredPct % 10^14) / 10^16`, minimum acceptance quorum of `(_minAcceptQuorumPct - _minAcceptQuorumPct % 10^14) / 10^16` and vote duations of `(_voteTime - _voteTime % 86400) / 86400` day `_voteTime >= 172800 ? 's' : ''`"
      },
      {
        "sig": "changeMinAcceptQuorumPct(address)",
        "roles": [
          "MODIFY_QUORUM_ROLE"
        ],
        "notice": "Change minimum acceptance quorum to `(_minAcceptQuorumPct - _minAcceptQuorumPct % 10^14) / 10^16`%"
      },
      {
        "sig": "newVote(bytes,address)",
        "roles": [
          "CREATE_VOTES_ROLE"
        ],
        "notice": "Create a new vote about \"`_metadata`\""
      },
      {
        "sig": "vote(uint256,bool,bool)",
        "roles": [],
        "notice": "Vote `_supports ? 'yay' : 'nay'` in vote #`_voteId`"
      },
      {
        "sig": "executeVote(uint256)",
        "roles": [],
        "notice": "Execute the result of vote #`_voteId`"
      },
      {
        "sig": "forward(bytes)",
        "roles": [],
        "notice": "Creates a vote to execute the desired action"
      },
      {
        "sig": "_vote(uint256,bool,address,bool)",
        "roles": [],
        "notice": null
      }
    ],
    "content": {
      "provider": "ipfs",
      "location": "QmfX6udPSMuadNtKHAZKPdf92hxpcGykvWWE6cgLAKjx7Z"
    },
    "contractAddress": "0x29D87425793ed582b0fa5e668dC5D0a2E8638961"
  },
  {
    "proxyAddress": "0xa46F2B43c7E8fAeab3b2DAD1d226E5458C8E8Ddb",
    "kernelAddress": "0x83C36cFA235eE2f06932936f6C02f8945f805E45",
    "appId": "0x7e852e0fcfce6551c13800f1e7476f982525c2b5277ba14b24339c68416336d1",
    "codeAddress": "0x5eb481F6B9f26b3FBE5ad4632CbdCeDddE686946",
    "isForwarder": false,
    "name": "Vault",
    "description": "Securely owns and manages tokens on behalf of a DAO.",
    "icons": [
      {
        "src": "images/icon.png",
        "sizes": "192x192"
      }
    ],
    "appName": "vault.aragonpm.eth",
    "version": "1.0.5",
    "roles": [
      {
        "name": "Request token allowances from Vault",
        "id": "REQUEST_ALLOWANCES_ROLE",
        "params": [
          "Token address",
          "Token amount"
        ],
        "bytes": "0xb3f7dd79e11d8e7e7ea82a3f0424d577d6c904b62e54a58458d29b327336decd"
      },
      {
        "name": "Transfer Vault's tokens",
        "id": "TRANSFER_ROLE",
        "params": [
          "Token address",
          "Receiver address",
          "Token amount"
        ],
        "bytes": "0x8502233096d909befbda0999bb8ea2f3a6be3c138b9fbf003752a4c8bce86f6c"
      }
    ],
    "path": "contracts/Vault.sol",
    "abi": [
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "connectors",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "TRANSFER_ROLE",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "erc20Connector",
            "type": "address"
          },
          {
            "name": "ethConnector",
            "type": "address"
          }
        ],
        "name": "initialize",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "addr",
            "type": "address"
          },
          {
            "name": "interfaceID",
            "type": "bytes4"
          }
        ],
        "name": "conformsToERC165",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "REGISTER_TOKEN_STANDARD",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "interfaceDetectionERC",
            "type": "uint32"
          }
        ],
        "name": "isInterfaceDetectionERCSupported",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "token",
            "type": "address"
          }
        ],
        "name": "detectTokenStandard",
        "outputs": [
          {
            "name": "standardId",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "EVMSCRIPT_REGISTRY_APP_ID",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint32"
          }
        ],
        "name": "supportedInterfaceDetectionERCs",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "token",
            "type": "address"
          },
          {
            "name": "standardId",
            "type": "uint256"
          }
        ],
        "name": "conformsToStandard",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "appId",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getInitializationBlock",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "standards",
        "outputs": [
          {
            "name": "erc",
            "type": "uint32"
          },
          {
            "name": "interfaceDetectionERC",
            "type": "uint32"
          },
          {
            "name": "interfaceID",
            "type": "bytes4"
          },
          {
            "name": "connector",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "EVMSCRIPT_REGISTRY_APP",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "baseVault",
            "type": "address"
          }
        ],
        "name": "initializeWithBase",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_sender",
            "type": "address"
          },
          {
            "name": "_role",
            "type": "bytes32"
          },
          {
            "name": "params",
            "type": "uint256[]"
          }
        ],
        "name": "canPerform",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "erc",
            "type": "uint32"
          },
          {
            "name": "interfaceDetectionERC",
            "type": "uint32"
          },
          {
            "name": "interfaceID",
            "type": "bytes4"
          },
          {
            "name": "connector",
            "type": "address"
          }
        ],
        "name": "registerStandard",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "kernel",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "ethConnectorBase",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "erc20ConnectorBase",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_script",
            "type": "bytes"
          }
        ],
        "name": "getExecutor",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "erc",
            "type": "uint32"
          },
          {
            "indexed": true,
            "name": "interfaceDetectionERC",
            "type": "uint32"
          },
          {
            "indexed": true,
            "name": "interfaceID",
            "type": "bytes4"
          },
          {
            "indexed": false,
            "name": "connector",
            "type": "address"
          }
        ],
        "name": "NewTokenStandard",
        "type": "event"
      }
    ],
    "functions": [
      {
        "sig": "Vault()",
        "roles": [],
        "notice": null
      },
      {
        "sig": "initialize(address,address)",
        "roles": [],
        "notice": null
      },
      {
        "sig": "initializeWithBase(address)",
        "roles": [],
        "notice": null
      },
      {
        "sig": "()",
        "roles": [],
        "notice": null
      },
      {
        "sig": "registerStandard(uint32,uint32,bytes4,address)",
        "roles": [
          "REGISTER_TOKEN_STANDARD"
        ],
        "notice": null
      }
    ],
    "content": {
      "provider": "ipfs",
      "location": "QmUtHperPCyegyyyoC5KFAgNJf5feCc7b44yDJbto8BuV6"
    },
    "contractAddress": "0x5eb481F6B9f26b3FBE5ad4632CbdCeDddE686946"
  },
  {
    "proxyAddress": "0x49e39B487cBc913f8DECC54f17D91f3E6305aEaE",
    "kernelAddress": "0x83C36cFA235eE2f06932936f6C02f8945f805E45",
    "appId": "0xbf8491150dafc5dcaee5b861414dca922de09ccffa344964ae167212e8c673ae",
    "codeAddress": "0x62De4A6FCeCF3B9396b46bD72A77616Fd56Eda2A",
    "isForwarder": false,
    "contractAddress": "0x62De4A6FCeCF3B9396b46bD72A77616Fd56Eda2A",
    "version": "1.0.15"
  },
  {
    "proxyAddress": "0x56B258C6afa41aA92cA2F7758F6cD6583894DAD3",
    "kernelAddress": "0x83C36cFA235eE2f06932936f6C02f8945f805E45",
    "appId": "0x6b20a3010614eeebf2138ccec99f028a61c811b3b1a3343b6ff635985c75c91f",
    "codeAddress": "0x3F7357a9711002B3F3aD349C625aaDbfb39AB7C4",
    "isForwarder": true,
    "name": "Token Manager",
    "description": "Controls an organization token allowing to mint new tokens, assign them and create vestings",
    "icons": [
      {
        "src": "images/icon.png",
        "sizes": "192x192"
      }
    ],
    "script": "/script.js",
    "start_url": "/index.html",
    "version": "1.0.19",
    "roles": [
      {
        "name": "Mint tokens",
        "id": "MINT_ROLE",
        "params": [
          "Receiver",
          "Token amount"
        ],
        "bytes": "0x154c00819833dac601ee5ddded6fda79d9d8b506b911b3dbd54cdb95fe6c3686"
      },
      {
        "name": "Issue tokens",
        "id": "ISSUE_ROLE",
        "params": [
          "Token amount"
        ],
        "bytes": "0x2406f1e99f79cea012fb88c5c36566feaeefee0f4b98d3a376b49310222b53c4"
      },
      {
        "name": "Assign tokens",
        "id": "ASSIGN_ROLE",
        "params": [
          "Receiver",
          "Token amount"
        ],
        "bytes": "0xf5a08927c847d7a29dc35e105208dbde5ce951392105d712761cc5d17440e2ff"
      },
      {
        "name": "Revoke vesting",
        "id": "REVOKE_VESTINGS_ROLE",
        "params": [
          "Holder"
        ],
        "bytes": "0x95ffc68daedf1eb334cfcd22ee24a5eeb5a8e58aa40679f2ad247a84140f8d6e"
      }
    ],
    "path": "contracts/TokenManager.sol",
    "abi": [
      {
        "constant": true,
        "inputs": [
          {
            "name": "_holder",
            "type": "address"
          }
        ],
        "name": "tokenGrantsCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x02a72a4c"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_holder",
            "type": "address"
          }
        ],
        "name": "spendableBalanceOf",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x0f8f8b83"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_receiver",
            "type": "address"
          },
          {
            "name": "_amount",
            "type": "uint256"
          },
          {
            "name": "_start",
            "type": "uint64"
          },
          {
            "name": "_cliff",
            "type": "uint64"
          },
          {
            "name": "_vesting",
            "type": "uint64"
          },
          {
            "name": "_revokable",
            "type": "bool"
          }
        ],
        "name": "assignVested",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x21cb18cd"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "holders",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x2a11ced0"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_receiver",
            "type": "address"
          },
          {
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "mint",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x40c10f19"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_from",
            "type": "address"
          },
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "onTransfer",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x4a393149"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "EVMSCRIPT_REGISTRY_APP_ID",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x60b1e057"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_holder",
            "type": "address"
          },
          {
            "name": "_time",
            "type": "uint256"
          }
        ],
        "name": "transferableBalance",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x72f8393c"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "appId",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x80afdea8"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "ISSUE_ROLE",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x856222f1"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getInitializationBlock",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x8b3dd749"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "transferable",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x92ff0d31"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "EVMSCRIPT_REGISTRY_APP",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x9b3fdf4c"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_holder",
            "type": "address"
          },
          {
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "burn",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x9dc29fac"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_sender",
            "type": "address"
          },
          {
            "name": "_role",
            "type": "bytes32"
          },
          {
            "name": "params",
            "type": "uint256[]"
          }
        ],
        "name": "canPerform",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xa1658fad"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "ASSIGN_ROLE",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xa51d9a8e"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "BURN_ROLE",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xb930908f"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_receiver",
            "type": "address"
          },
          {
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "assign",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xbe760488"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_sender",
            "type": "address"
          },
          {
            "name": "",
            "type": "bytes"
          }
        ],
        "name": "canForward",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xc0774df3"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "allHolders",
        "outputs": [
          {
            "name": "",
            "type": "address[]"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xc80a3aa6"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "issue",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xcc872b66"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "kernel",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xd4aae0c4"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_evmScript",
            "type": "bytes"
          }
        ],
        "name": "forward",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xd948d468"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          },
          {
            "name": "_spender",
            "type": "address"
          },
          {
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "onApprove",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xda682aeb"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_token",
            "type": "address"
          },
          {
            "name": "_transferable",
            "type": "bool"
          },
          {
            "name": "_maxAccountTokens",
            "type": "uint256"
          },
          {
            "name": "_logHolders",
            "type": "bool"
          }
        ],
        "name": "initialize",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xe918c62f"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "MINT_ROLE",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xe9a9c850"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "maxAccountTokens",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xecfda432"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "REVOKE_VESTINGS_ROLE",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xedc168f1"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "proxyPayment",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function",
        "signature": "0xf48c3054"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_script",
            "type": "bytes"
          }
        ],
        "name": "getExecutor",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xf92a79ff"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_holder",
            "type": "address"
          },
          {
            "name": "_vestingId",
            "type": "uint256"
          }
        ],
        "name": "revokeVesting",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0xfa6799f2"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "token",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xfc0c546a"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "logHolders",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xfd2c0d68"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "isForwarder",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function",
        "signature": "0xfd64eccb"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "receiver",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "vestingId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "NewVesting",
        "type": "event",
        "signature": "0x627ad26dcfe82ec79b33fda0ddd062f6fab9f4914acac8345f79090dfd86fb54"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "receiver",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "vestingId",
            "type": "uint256"
          }
        ],
        "name": "RevokeVesting",
        "type": "event",
        "signature": "0xd84a4ab319cd8ac27a1baf06f5020baf3eb7692cca480d7a7fb68596befe5ca9"
      }
    ],
    "functions": [
      {
        "sig": "initialize()",
        "roles": [],
        "notice": "Initializes Token Manager for `_token.symbol(): string`, `transerable ? 'T' : 'Not t'`ransferable`_maxAccountTokens > 0 ? ', with a maximum of ' _maxAccountTokens ' per account' : ''` and with`_logHolders ? '' : 'out'` storage of token holders."
      },
      {
        "sig": "mint(address,uint256)",
        "roles": [
          "MINT_ROLE"
        ],
        "notice": "Mint `_amount / 10^18` tokens for `_receiver`"
      },
      {
        "sig": "issue(uint256)",
        "roles": [
          "ISSUE_ROLE"
        ],
        "notice": "Mint `_amount / 10^18` tokens"
      },
      {
        "sig": "assign(address,uint256)",
        "roles": [
          "ASSIGN_ROLE"
        ],
        "notice": "Assign `_amount / 10^18` tokens to `_receiver` from Token Manager's holdings"
      },
      {
        "sig": "burn(address,uint256)",
        "roles": [
          "BURN_ROLE"
        ],
        "notice": "Burn `_amount / 10^18` tokens from `_holder`"
      },
      {
        "sig": "assignVested(address,uint256,uint64,uint64,uint64,bool)",
        "roles": [
          "ASSIGN_ROLE"
        ],
        "notice": "Assign `_amount / 10^18` tokens to `_receiver` with a `_revokable : 'revokable' : ''` vesting starting at `_start` and a cliff at `_cliff`, with vesting on `_vesting`"
      },
      {
        "sig": "revokeVesting(address,uint256)",
        "roles": [
          "REVOKE_VESTINGS_ROLE"
        ],
        "notice": "Revoke vesting `_vestingId` from `_holder`, returning unvested tokens to Token Manager"
      },
      {
        "sig": "forward(bytes)",
        "roles": [],
        "notice": "Execute desired action as a token holder"
      },
      {
        "sig": "onTransfer(address,address,uint)",
        "roles": [],
        "notice": null
      },
      {
        "sig": "proxyPayment(address)",
        "roles": [],
        "notice": "Called when `_owner` sends ether to the MiniMe Token contract"
      },
      {
        "sig": "onApprove(address,address,uint)",
        "roles": [],
        "notice": null
      }
    ],
    "content": {
      "provider": "ipfs",
      "location": "QmQ94bjem1wcBB2UFeHFRa59D2DSYDzft43DRytDREEbAv"
    },
    "contractAddress": "0x3F7357a9711002B3F3aD349C625aaDbfb39AB7C4",
    "identifier": "pierre"
  }
]

export default rawApps
