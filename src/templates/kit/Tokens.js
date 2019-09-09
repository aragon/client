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

function useFieldsLayout() {
  // In its own hook to be adapted on smaller views
  return `
    display: grid;
    grid-template-columns: auto ${12 * GU}px;
    grid-column-gap: ${1.5 * GU}px;
  `
}

function validateDuplicateAddresses(members) {
  const validAddresses = members
    .map(([address]) => address.toLowerCase())
    .filter(address => isAddress(address))

  return validAddresses.length === new Set(validAddresses).size
}

function validationError(tokenName, tokenSymbol, members) {
  if (!members.some(([address]) => isAddress(address))) {
    return 'You need at least one valid address.'
  }
  if (!members.some(([address, stake]) => isAddress(address) && stake > 0)) {
    return 'You need at least one valid address with a positive balance.'
  }
  if (!validateDuplicateAddresses(members)) {
    return 'One of your members is using the same address than another member. Please ensure every member address is unique.'
  }
  if (!tokenName) {
    return 'Please add a token name.'
  }
  if (!tokenSymbol) {
    return 'Please add a token symbol.'
  }
  return null
}

function Tokens({
  back,
  data,
  fields,
  next,
  screenIndex,
  screens,
  accountStake = -1,
}) {
  const theme = useTheme()
  const fieldsLayout = useFieldsLayout()

  const [formError, setFormError] = useState()

  const fixedStake = accountStake !== -1

  const { tokens: tokensData = {} } = data
  const [tokenName, setTokenName] = useState(tokensData.tokenName || '')
  const [tokenSymbol, setTokenSymbol] = useState(tokensData.tokenSymbol || '')

  const [members, setMembers] = useState(
    tokensData.members && tokensData.members.length > 0
      ? tokensData.members
      : [['', accountStake]]
  )

  const handleTokenNameChange = useCallback(event => {
    setFormError(null)
    setTokenName(event.target.value.trim())
  }, [])

  const handleTokenSymbolChange = useCallback(event => {
    setFormError(null)
    setTokenSymbol(event.target.value.trim())
  }, [])

  const addMember = useCallback(() => {
    setFormError(null)
    setMembers(members => [...members, ['', accountStake]])
  }, [accountStake])

  const removeMember = useCallback(
    index => {
      setFormError(null)
      setMembers(members =>
        members.length < 2
          ? // When the remove button of the last field
            // gets clicked, we only empty the field.
            [['', accountStake]]
          : members.filter((_, i) => i !== index)
      )
    },
    [accountStake]
  )

  const updateMember = useCallback((index, updatedAccount, updatedStake) => {
    setFormError(null)
    setMembers(members =>
      members.map((member, i) =>
        i === index ? [updatedAccount, updatedStake] : member
      )
    )
  }, [])

  const handleNext = useCallback(() => {
    const error = validationError(tokenName, tokenSymbol, members)
    setFormError(error)
    if (!error) {
      next({
        ...data,
        tokens: {
          tokenName,
          tokenSymbol,
          members: members.filter(
            ([account, stake]) => isAddress(account) && stake > 0
          ),
        },
      })
    }
  }, [data, next, tokenName, tokenSymbol, members])

  const handleTokenNameRef = useCallback(element => {
    if (element) {
      element.focus()
    }
  }, [])

  const hideRemoveButton = members.length < 2 && !members[0]

  const disableNext =
    !tokenName ||
    !tokenSymbol ||
    members.every(([account, stake]) => !account || stake < 0)

  return (
    <form
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
          subtitle="Choose your Tokens app settings below."
        />

        <div
          css={`
            ${fieldsLayout}
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
                ref={handleTokenNameRef}
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
        </div>
        <Field
          label={
            <div
              css={`
                width: 100%;
                ${fieldsLayout}
              `}
            >
              <div>Tokenholders</div>
              {!fixedStake && <div>Balances</div>}
            </div>
          }
        >
          <div>
            {members.map((member, index) => (
              <MemberField
                key={index}
                index={index}
                member={member}
                onRemove={removeMember}
                hideRemoveButton={hideRemoveButton}
                onUpdate={updateMember}
                displayStake={!fixedStake}
              />
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

      {formError && (
        <Info
          mode="error"
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          {formError}
        </Info>
      )}

      <Info
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        These settings will determine the name and symbol of the token that will
        be created for your organization. Add members to define the initial
        distribution of this token.
      </Info>

      <PrevNextFooter
        backEnabled
        nextEnabled={!disableNext}
        nextLabel={`Next: ${screens[screenIndex + 1][0]}`}
        onBack={back}
        onNext={handleNext}
      />
    </form>
  )
}

function MemberField({
  index,
  member,
  hideRemoveButton,
  onUpdate,
  onRemove,
  displayStake,
}) {
  const theme = useTheme()
  const fieldsLayout = useFieldsLayout()

  const [account, stake] = member

  const handleRemove = useCallback(() => {
    onRemove(index)
  }, [onRemove, index])

  const handleAccountChange = useCallback(
    event => {
      onUpdate(index, event.target.value, stake)
    },
    [onUpdate, stake, index]
  )

  const handleStakeChange = useCallback(
    event => {
      const value = parseInt(event.target.value, 10)
      onUpdate(index, account, isNaN(value) ? -1 : value)
    },
    [onUpdate, account, index]
  )

  return (
    <div
      css={`
        ${fieldsLayout}
        position: relative;
        margin-bottom: ${1.5 * GU}px;
      `}
    >
      <div>
        <TextInput
          adornment={
            <span>
              {!hideRemoveButton && (
                <Button
                  onClick={handleRemove}
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
          onChange={handleAccountChange}
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
      <div>
        {displayStake && (
          <TextInput
            onChange={handleStakeChange}
            value={stake === -1 ? '' : stake}
            wide
          />
        )}
      </div>
    </div>
  )
}

export default Tokens
