import React, { useCallback, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  EthIdenticon,
  Field,
  GU,
  Help,
  IconPlus,
  IconTrash,
  Info,
  isAddress,
  RADIUS,
  Switch,
  TextInput,
  textStyle,
  useTheme,
} from '@aragon/ui'
import {
  Header,
  IdentityBadge,
  KnownAppBadge,
  Navigation,
  ScreenPropsType,
} from '../../kit'

function useFieldsLayout() {
  // In its own hook to be adapted for smaller views
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

function validationError(
  tokenName,
  tokenSymbol,
  members,
  editMembers,
  fixedStake
) {
  if (editMembers && !members.some(([address]) => isAddress(address))) {
    return 'You need at least one valid address.'
  }
  if (
    editMembers &&
    !members.some(
      ([address, stake]) => isAddress(address) && (stake > 0 || fixedStake)
    )
  ) {
    return 'You need at least one valid address with a positive balance.'
  }
  if (editMembers && !validateDuplicateAddresses(members)) {
    return 'One of your members is using the same address than another member. Please ensure every member address is unique.'
  }
  if (!tokenName.trim()) {
    return 'Please add a token name.'
  }
  if (!tokenSymbol) {
    return 'Please add a token symbol.'
  }
  return null
}

function Tokens({
  accountStake,
  dataKey,
  appLabel,
  editMembers,
  screenProps: { back, data, next, screenIndex },
  title,
}) {
  const screenData = (dataKey ? data[dataKey] : data) || {}
  const [initialFixedStake, initialTransferable] = [
    'fixedStake' in screenData ? screenData.fixedStake : accountStake !== -1,
    'transferable' in screenData ? screenData.transferable : true,
  ]

  const theme = useTheme()
  const fieldsLayout = useFieldsLayout()

  const [formError, setFormError] = useState()
  const [fixedStake, setFixedStake] = useState(initialFixedStake)
  const [tokenName, setTokenName] = useState(screenData.tokenName || '')
  const [tokenSymbol, setTokenSymbol] = useState(screenData.tokenSymbol || '')
  const [transferable, setTransferable] = useState(initialTransferable)

  const [members, setMembers] = useState(
    screenData.members && screenData.members.length > 0
      ? screenData.members
      : [['', accountStake]]
  )

  const handleTokenNameChange = useCallback(event => {
    setFormError(null)
    setTokenName(event.target.value)
  }, [])

  const handleTokenSymbolChange = useCallback(event => {
    setFormError(null)
    setTokenSymbol(event.target.value.trim().toUpperCase())
  }, [])

  const membersRef = useRef()
  const [focusLastMemberNext, setFocusLastMemberNext] = useState(false)

  useEffect(() => {
    if (!focusLastMemberNext || !membersRef.current) {
      return
    }

    setFocusLastMemberNext(false)

    // This could be managed in individual MemberField components, but using
    // the container with a .member class makes it simpler to manage, since we
    // want to focus in three cases:
    //   - A new field is being added.
    //   - A field is being removed.
    //   - The first field is being emptied.
    //
    const elements = membersRef.current.querySelectorAll('.member')
    if (elements.length > 0) {
      elements[elements.length - 1].querySelector('input').focus()
    }
  }, [focusLastMemberNext])

  const focusLastMember = useCallback(() => {
    setFocusLastMemberNext(true)
  }, [])

  const addMember = useCallback(() => {
    setFormError(null)
    setMembers(members => [...members, ['', accountStake]])
    focusLastMember()
  }, [accountStake, focusLastMember])

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
      focusLastMember()
    },
    [accountStake, focusLastMember]
  )

  const updateMember = useCallback((index, updatedAccount, updatedStake) => {
    setFormError(null)
    setMembers(members =>
      members.map((member, i) =>
        i === index ? [updatedAccount, updatedStake] : member
      )
    )
  }, [])

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      const error = validationError(
        tokenName,
        tokenSymbol,
        members,
        editMembers,
        fixedStake
      )
      setFormError(error)
      if (!error) {
        const fixedStakeMembers = fixedStake
          ? members.map(([account]) => [account, 1])
          : members
        const screenData = {
          fixedStake,
          tokenName,
          tokenSymbol,
          transferable,
          members: fixedStakeMembers.filter(
            ([account, stake]) => isAddress(account) && stake > 0
          ),
        }
        const mergedData = dataKey
          ? { ...data, [dataKey]: screenData }
          : { ...data, ...screenData }

        next({ ...mergedData, skip: false })
      }
    },
    [
      data,
      dataKey,
      editMembers,
      fixedStake,
      members,
      next,
      tokenName,
      tokenSymbol,
      transferable,
    ]
  )

  // Focus the token name as soon as it becomes available
  const handleTokenNameRef = useCallback(element => {
    if (element) {
      element.focus()
    }
  }, [])

  const hideRemoveButton = members.length < 2 && !members[0]

  const disableNext =
    !tokenName ||
    !tokenSymbol ||
    (editMembers &&
      members.every(
        ([account, stake]) => !account || (!fixedStake && stake < 0)
      ))

  const generatedNextLabel = `Next: ${
    data.selectedTokens > 1 && screenIndex === 2 ? 'Second Tokens' : 'Voting'
  }`

  return (
    <form
      css={`
        display: grid;
        align-items: center;
        justify-content: center;
      `}
    >
      <div>
        <Header
          title={title}
          subtitle={
            <span
              css={`
                display: flex;
                align-items: center;
                justify-content: center;
              `}
            >
              {`Choose your ${
                data.selectedTokens > 1
                  ? screenIndex === 2
                    ? 'first'
                    : 'second'
                  : ''
              }`}
              <span
                css={`
                  display: flex;
                  margin: 0 ${1.5 * GU}px;
                `}
              >
                <KnownAppBadge
                  appName="token-manager.aragonpm.eth"
                  label={appLabel}
                />
              </span>
              settings below.
            </span>
          }
        />

        <div
          css={`
            ${fieldsLayout};
          `}
        >
          <Field
            label={
              <React.Fragment>
                {`${
                  data.selectedTokens > 1
                    ? screenIndex === 2
                      ? 'first'
                      : 'second'
                    : ''
                } token name`}
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
      </div>

      <Field label="token settings">
        <div
          css={`
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: ${2 * GU}px;

            & + & {
              margin-top: ${1.5 * GU}px;
            }
          `}
        >
          <div
            css={`
              ${textStyle('body3')};
            `}
          >
            Members can hold a maximum of one for this token (e.g. membership)
          </div>

          <Switch checked={fixedStake} onChange={setFixedStake} />
        </div>
        <div
          css={`
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: ${2 * GU}px;

            & + & {
              margin-top: ${1.5 * GU}px;
            }
          `}
        >
          <div
            css={`
              ${textStyle('body3')};
            `}
          >
            Members can transfer this token to other Ethereum addresses
          </div>
          <Switch checked={transferable} onChange={setTransferable} />
        </div>
      </Field>

      {editMembers && (
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
          <div ref={membersRef}>
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
      )}

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
        be created for your organization.
        {editMembers
          ? ' Add members to define the initial distribution of this token.'
          : ''}
      </Info>

      <Navigation
        backEnabled
        nextEnabled={!disableNext}
        nextLabel={generatedNextLabel}
        onBack={back}
        onNext={handleSubmit}
      />
    </form>
  )
}

Tokens.propTypes = {
  appLabel: PropTypes.string,
  accountStake: PropTypes.number,
  dataKey: PropTypes.string,
  editMembers: PropTypes.bool,
  screenProps: ScreenPropsType.isRequired,
  title: PropTypes.string,
}

Tokens.defaultProps = {
  accountStake: -1,
  appLabel: 'Tokens',
  dataKey: 'tokens',
  editMembers: true,
  title: 'Configure template',
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
      className="member"
      css={`
        display: flex;
        position: relative;
        margin-bottom: ${1.5 * GU}px;
      `}
    >
      <div
        css={`
          flex: 1;
        `}
      >
        <TextInput
          adornment={
            <span css="transform: translateY(1px)">
              {!hideRemoveButton && (
                <Button
                  display="icon"
                  icon={
                    <IconTrash
                      css={`
                        color: ${theme.negative};
                      `}
                    />
                  }
                  label="Remove"
                  onClick={handleRemove}
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
          <div
            css={`
              margin-left: ${1.5 * GU}px;
              width: ${12 * GU}px;
            `}
          >
            <TextInput
              onChange={handleStakeChange}
              value={stake === -1 ? '' : stake}
              wide
            />
          </div>
        )}
      </div>
    </div>
  )
}

MemberField.propTypes = {
  displayStake: PropTypes.bool.isRequired,
  hideRemoveButton: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  member: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ).isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
}

function formatReviewFields(screenData) {
  return [
    [
      'Token name & symbol',
      `${screenData.tokenName} (${screenData.tokenSymbol})`,
    ],
    ['Maximum of one token per account', screenData.fixedStake ? 'Yes' : 'No'],
    ['Token transferable', screenData.transferable ? 'Yes' : 'No'],
    ...screenData.members.map(([account, amount], i) => [
      `Tokenholder #${i + 1}`,
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <IdentityBadge entity={account} />
        <span
          css={`
            margin-left: ${2 * GU}px;
          `}
        >
          {amount} {screenData.tokenSymbol}
        </span>
      </div>,
    ]),
  ]
}

Tokens.formatReviewFields = formatReviewFields
export default Tokens
