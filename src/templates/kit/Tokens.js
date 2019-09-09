import React, { useCallback, useState } from 'react'
import {
  Button,
  EthIdenticon,
  Field,
  GU,
  Help,
  IconPlus,
  IconTrash,
  Info,
  RADIUS,
  TextInput,
  isAddress,
  useTheme,
} from '@aragon/ui'
import { Header, PrevNextFooter } from '.'

function Tokens({ back, data, fields, next, screenIndex, screens }) {
  const theme = useTheme()

  const { tokens: tokensData = {} } = data
  const [tokenName, setTokenName] = useState(tokensData.tokenName || '')
  const [tokenSymbol, setTokenSymbol] = useState(tokensData.tokenSymbol || '')
  const [members, setMembers] = useState(
    tokensData.members && tokensData.members.length > 0
      ? tokensData.members
      : ['']
  )

  const handleTokenNameChange = useCallback(event => {
    setTokenName(event.target.value)
  }, [])

  const handleTokenSymbolChange = useCallback(event => {
    setTokenSymbol(event.target.value)
  }, [])

  const addMember = useCallback(() => {
    setMembers(members => [...members, ''])
  }, [])

  const removeMember = useCallback(index => {
    setMembers(members =>
      members.length < 2
        ? // When the remove button of the last field
          // gets clicked, we only empty the field.
          ['']
        : members.filter((_, i) => i !== index)
    )
  }, [])

  const updateMember = useCallback((index, updatedAccount) => {
    setMembers(members =>
      members.map((account, i) => (i === index ? updatedAccount : account))
    )
  }, [])

  const handleNext = useCallback(() => {
    next({
      ...data,
      tokens: {
        tokenName,
        tokenSymbol,
        members: members.filter(addr => isAddress(addr)),
      },
    })
  }, [data, next, tokenName, tokenSymbol, members])

  const hideRemoveButton = members.length < 2 && !members[0]

  return (
    <div
      css={`
        display: grid;
        align-items: center;
        justify-content: center;
      `}
    >
      <div
        css={`
          max-width: ${82 * GU}px;
        `}
      >
        <Header
          title="Configure template"
          subtitle="Choose your Tokens settings below."
        />

        <div
          css={`
            display: grid;
            grid-template-columns: auto ${12 * GU}px;
            grid-column-gap: ${1.5 * GU}px;
          `}
        >
          <Field
            label={
              <React.Fragment>
                Token name
                <Help hint="What’s the token name?">
                  <strong>Token name</strong> is the name you can assign to the
                  token that will be minted when creating this organization.
                </Help>
              </React.Fragment>
            }
          >
            {({ id }) => (
              <TextInput
                id={id}
                onChange={handleTokenNameChange}
                placeholder="My Organization Token"
                value={tokenName}
                wide
              />
            )}
          </Field>

          <Field
            label={
              <React.Fragment>
                Token symbol
                <Help hint="What’s the token symbol?">
                  <strong>Token symbol</strong> or ticker is a shortened name
                  (typically in capital letters) that refers to a token or coin
                  on a trading platform. For example: ANT.
                </Help>
              </React.Fragment>
            }
          >
            {({ id }) => (
              <TextInput
                id={id}
                onChange={handleTokenSymbolChange}
                value={tokenSymbol}
                placeholder="MOT"
                wide
              />
            )}
          </Field>

          <Field label="Members">
            <div>
              {members.map((account, i) => (
                <div
                  key={i}
                  css={`
                    position: relative;
                    margin-bottom: ${1.5 * GU}px;
                  `}
                >
                  <TextInput
                    key={i}
                    adornment={
                      <span>
                        {!hideRemoveButton && (
                          <Button
                            onClick={() => removeMember(i)}
                            icon={
                              <IconTrash
                                css={`
                                  color: ${theme.negative};
                                `}
                              />
                            }
                            size="mini"
                          />
                        )}
                      </span>
                    }
                    adornmentPosition="end"
                    adornmentSettings={{ width: 52, padding: 8 }}
                    onChange={event => updateMember(i, event.target.value)}
                    placeholder="Ethereum address"
                    value={account}
                    wide
                    css={`
                      padding-left: ${4.5 * GU}px;
                    `}
                  />

                  <div
                    css={`
                      position: absolute;
                      top: ${1 * GU}px;
                      left: ${1 * GU}px;
                    `}
                  >
                    {isAddress(account) ? (
                      <EthIdenticon address={account} radius={RADIUS} />
                    ) : (
                      <div
                        css={`
                          width: ${3 * GU}px;
                          height: ${3 * GU}px;
                          background: ${theme.disabled};
                          border-radius: ${RADIUS}px;
                        `}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button
              icon={
                <IconPlus
                  css={`
                    color: ${theme.accent};
                  `}
                />
              }
              label="Add more"
              onClick={addMember}
            />
          </Field>
        </div>

        <Info
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          These settings will determine the name and symbol of the token that
          will be created for your organization. Add members to define the
          initial distribution of this token.
        </Info>

        <PrevNextFooter
          backEnabled
          nextEnabled
          nextLabel={`Next: ${screens[screenIndex + 1][0]}`}
          onBack={back}
          onNext={handleNext}
        />
      </div>
    </div>
  )
}

export default Tokens
