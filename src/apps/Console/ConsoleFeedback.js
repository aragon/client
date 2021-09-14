import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link, textStyle, GU, LoadingRing } from '@aragon/ui'
import { AppType } from '../../prop-types'
import { shortenAddress } from '../../util/web3'

// Tuple of [display name, app name]
const INSTALLABLE_APPS = [
  ['Agent', 'agent'],
  ['Finance', 'finance'],
  ['Tokens', 'token-manager'],
  ['Vault', 'vault'],
  ['Voting', 'voting'],
]
const SUGGESTED_COMMANDS = ['Exec', 'Act']

function ConsoleFeedback({
  apps,
  currentParsedCommand,
  loading,
  onCommandClick,
}) {
  if (loading) {
    return (
      <div
        css={`
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: ${6 * GU}px 0 ${6 * GU}px 0;
        `}
      >
        <LoadingRing />
        <span
          css={`
            margin-left: ${1 * GU}px;
            ${textStyle('body2')};
          `}
        >
          Executing command…
        </span>
      </div>
    )
  }

  if (currentParsedCommand.length < 2) {
    return (
      <>
        <Paragraph>
          You can interact with this organization by using the following console
          commands:
        </Paragraph>
        <div
          css={`
            overflow: auto;
          `}
        >
          {SUGGESTED_COMMANDS.map(command => (
            <InteractiveCommand
              key={command}
              css={`
                display: block;
              `}
              onClick={() => onCommandClick(command)}
            >
              {command}
            </InteractiveCommand>
          ))}
        </div>
      </>
    )
  }

  if (currentParsedCommand[0] === 'install') {
    if (currentParsedCommand.length < 3) {
      return (
        <>
          <Paragraph>You can install the following apps:</Paragraph>
          <div
            css={`
              overflow: auto;
            `}
          >
            {INSTALLABLE_APPS.map(([displayName, appName]) => (
              <InteractiveCommand
                key={appName}
                css={`
                  display: block;
                `}
                onClick={() => onCommandClick(appName)}
              >
                {displayName}
              </InteractiveCommand>
            ))}
          </div>
        </>
      )
    }

    return (
      <>
        <Paragraph>
          Please enter the corresponding parameters and permissions needed for
          installing the app, in this format:
        </Paragraph>
        <Command
          css={`
            margin-left: ${1 * GU}px;
          `}
        >
          install/appName/(…initparams)/…PERMISSION_ROLE:ADDRESS_MANAGER:ADDRESS_GRANTEE
        </Command>
        <Paragraph>
          You can set multiple permissions by separating them with a comma.
        </Paragraph>
      </>
    )
  }

  if (currentParsedCommand[0] === 'exec') {
    if (currentParsedCommand.length < 3) {
      return (
        <>
          <Paragraph>You can interact with the following apps:</Paragraph>
          <div
            css={`
              overflow: auto;
            `}
          >
            {apps.map(app => (
              <InteractiveCommand
                key={app.proxyAddress}
                css={`
                  display: block;
                `}
                onClick={() => onCommandClick(app.proxyAddress)}
              >
                <span>{app.name}</span> (
                <span title={app.proxyAddress}>
                  {shortenAddress(app.proxyAddress)}
                </span>
                )
              </InteractiveCommand>
            ))}
          </div>
        </>
      )
    }

    return (
      <>
        <Paragraph>
          Please enter the corresponding method and parameters needed for
          interacting with the app, in this format:
        </Paragraph>
        <Command
          css={`
            margin-left: ${1 * GU}px;
          `}
        >
          exec/appAddress/methodName(…args)
        </Command>
      </>
    )
  }

  if (currentParsedCommand[0] === 'act') {
    if (currentParsedCommand.length < 3) {
      const agentInstalled =
        apps.filter(app => app.name.toLowerCase() === 'agent').length > 0
      if (!agentInstalled) {
        return (
          <>
            <Paragraph>
              There are no Agent instances installed in this organization.
            </Paragraph>
            <Paragraph>
              If you would like to install an Agent, please read{' '}
              <Link
                external
                href="https://hack.aragon.org/docs/cli-dao-commands#dao-install"
              >
                the documentation
              </Link>{' '}
              or ask our{' '}
              <Link external href="https://spectrum.chat/aragon">
                Spectrum community
              </Link>{' '}
              for help.
            </Paragraph>
          </>
        )
      }

      return (
        <>
          <Paragraph>
            Please select the corresponding Agent instance to interact with:
          </Paragraph>
          <div
            css={`
              overflow: auto;
            `}
          >
            {apps
              .filter(app => app.name.toLowerCase() === 'agent')
              .map((agentApp, index) => (
                <InteractiveCommand
                  key={agentApp.proxyAddress}
                  css={`
                    display: block;
                  `}
                  onClick={() => onCommandClick(agentApp.proxyAddress)}
                >
                  Agent #{index + 1} ({shortenAddress(agentApp.proxyAddress)})
                </InteractiveCommand>
              ))}
          </div>
        </>
      )
    }

    return (
      <>
        <Paragraph>
          Pass the parameters required for the Agent's execute function, in this
          format:
        </Paragraph>
        <Command
          css={`
            margin-left: ${1 * GU}px;
          `}
        >
          act/agentAddress/targetAddress/methodName(type: arg)
        </Command>
        <Paragraph>Where:</Paragraph>
        <ul
          css={`
            margin-bottom: ${1 * GU}px;
            list-style-position: inside;
            ${textStyle('body2')};

            > li {
              margin-left: ${1 * GU}px;
            }
          `}
        >
          <li>
            <span
              css={`
                ${textStyle('address1')}
              `}
            >
              targetAddress
            </span>
            : the address of the contract to interact with
          </li>
          <li>
            <span
              css={`
                ${textStyle('address1')}
              `}
            >
              methodName
            </span>
            : the function call, with its types and parameters
          </li>
        </ul>
      </>
    )
  }

  return <Command css="margin: 0">Unrecognized command</Command>
}

ConsoleFeedback.propTypes = {
  apps: PropTypes.arrayOf(AppType).isRequired,
  currentParsedCommand: PropTypes.array,
  loading: PropTypes.bool,
  onCommandClick: PropTypes.func,
}

const Command = styled.p`
  margin-bottom: ${1 * GU}px;
  ${textStyle('address1')};
`

const InteractiveCommand = props => <Command as={Link} {...props} />

const Paragraph = styled.p`
  margin-bottom: ${1 * GU}px;
  ${textStyle('body2')};
`

export default ConsoleFeedback
