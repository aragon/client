import React, { useCallback, useState } from 'react'
import {
  Button,
  EthIdenticon,
  Field,
  GU,
  RADIUS,
  IconPlus,
  IconTrash,
  Info,
  TextInput,
  useTheme,
  isAddress,
} from '@aragon/ui'
import { Header, PrevNextFooter } from '.'

function Tokens({ back, data, fields, next, screenIndex, screens }) {
  const theme = useTheme()

  const [tokenName, setTokenName] = useState(data.tokenName || '')
  const [tokenSymbol, setTokenSymbol] = useState(data.tokenSymbol || '')
  const [members, setMembers] = useState(data.members || [''])

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
      members.length < 2 ? members : members.filter((_, i) => i !== index)
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
      tokenName,
      tokenSymbol,
      members: members.filter(addr => isAddress(addr)),
    })
  }, [data, next, tokenName, tokenSymbol, members])

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
          <Field label="Token name">
            <TextInput
              value={tokenName}
              onChange={handleTokenNameChange}
              wide
            />
          </Field>

          <Field label="Token symbol">
            <TextInput
              value={tokenSymbol}
              onChange={handleTokenSymbolChange}
              wide
            />
          </Field>

          <Field label="Members">
            <div>
              {members.map((account, i) => (
                <div
                  css={`
                    position: relative;
                    margin-bottom: ${1.5 * GU}px;
                  `}
                >
                  <TextInput
                    key={i}
                    adornment={
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
                    }
                    adornmentPosition="end"
                    adornmentSettings={{ width: 52, padding: 8 }}
                    onChange={event => updateMember(i, event.target.value)}
                    value={account}
                    css={`
                      padding-left: ${4.5 * GU}px;
                    `}
                    wide
                  />

                  <EthIdenticon
                    address={account}
                    radius={RADIUS}
                    css={`
                      position: absolute;
                      top: ${1 * GU}px;
                      left: ${1 * GU}px;
                    `}
                  />
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
          These settings will define your organization’s finances, for example,
          the duration of a budget or how often a recurrent payment should be
          executed.
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
