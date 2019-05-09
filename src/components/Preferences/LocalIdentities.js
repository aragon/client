import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { format } from 'date-fns'
import {
  Button,
  Checkbox,
  IconCross,
  IdentityBadge,
  Modal,
  Info,
  breakpoint,
  font,
  theme,
} from '@aragon/ui'
import LocalIdentityPopoverTitle from '../IdentityBadge/LocalIdentityPopoverTitle'
import { LocalIdentityModalContext } from '../LocalIdentityModal/LocalIdentityModalManager'
import {
  IdentityContext,
  identityEventTypes,
} from '../IdentityManager/IdentityManager'
import EmptyLocalIdentities from './EmptyLocalIdentities'
import Import from './Import'
import { GU } from '../../utils'

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

const SelectableLocalIdentities = React.memo(
  ({ localIdentities, ...props }) => {
    const identities = React.useMemo(
      () =>
        Object.entries(localIdentities).map(([address, identity]) => ({
          ...identity,
          address,
        })),
      [localIdentities]
    )
    const initialAddressesSelected = React.useMemo(
      () => new Map(identities.map(({ address }) => [address, true])),
      [identities]
    )
    const [addressesSelected, setAddressesSelected] = React.useState(
      initialAddressesSelected
    )

    const handleToggleAll = React.useCallback(
      () =>
        setAddressesSelected(
          new Map(
            identities.map(({ address }) => [
              address,
              !(
                Array.from(addressesSelected.values()).every(v => v) ||
                Array.from(addressesSelected.values()).some(v => v)
              ),
            ])
          )
        ),
      [addressesSelected, identities]
    )
    const handleToggleAddress = React.useCallback(
      address => () =>
        setAddressesSelected(
          new Map([
            ...addressesSelected,
            [address, !addressesSelected.get(address)],
          ])
        ),
      [addressesSelected]
    )

    React.useEffect(() => {
      setAddressesSelected(initialAddressesSelected)
    }, [initialAddressesSelected])

    const [opened, setOpened] = React.useState(false)

    return (
      <LocalIdentities
        {...props}
        identities={identities}
        onToggleAll={handleToggleAll}
        onToggleAddress={handleToggleAddress}
        addressesSelected={addressesSelected}
        opened={opened}
        setOpened={setOpened}
      />
    )
  }
)

SelectableLocalIdentities.propTypes = {
  dao: PropTypes.string.isRequired,
  localIdentities: PropTypes.object,
  onClearAll: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onModify: PropTypes.func.isRequired,
  onModifyEvent: PropTypes.func,
}

SelectableLocalIdentities.defaultProps = {
  localIdentities: {},
}

const LocalIdentities = React.memo(
  ({
    addressesSelected,
    dao,
    identities,
    onClearAll,
    onImport,
    onModify,
    onModifyEvent,
    onToggleAddress,
    opened,
    setOpened,
    onToggleAll,
  }) => {
    const { identityEvents$ } = React.useContext(IdentityContext)
    const { showLocalIdentityModal } = React.useContext(
      LocalIdentityModalContext
    )
    const updateLabel = React.useCallback(address => async () => {
      try {
        await showLocalIdentityModal(address)
        // preferences get all
        onModifyEvent()
        // for iframe apps
        identityEvents$.next({ type: identityEventTypes.MODIFY, address })
      } catch (e) {
        /* nothing was updated */
      }
    })

    const [allSelected, someSelected] = React.useMemo(
      () => [
        Array.from(addressesSelected.values()).every(v => v),
        Array.from(addressesSelected.values()).some(v => v),
      ],
      [addressesSelected]
    )
    // standard: https://en.wikipedia.org/wiki/ISO_8601
    const today = format(Date.now(), 'yyyy-MM-dd')
    const downloadHref = React.useMemo(
      () =>
        window.URL.createObjectURL(
          new Blob(
            [
              JSON.stringify(
                identities.filter(({ address }) =>
                  addressesSelected.get(address)
                )
              ),
            ],
            { type: 'text/json' }
          )
        ),
      [identities]
    )

    if (!identities.length) {
      return <EmptyLocalIdentities onImport={onImport} />
    }

    return (
      <React.Fragment>
        <Headers>
          <div>
            {!iOS && (
              <StyledCheckbox
                checked={allSelected}
                onChange={onToggleAll}
                indeterminate={!allSelected && someSelected}
              />
            )}
            Custom label
          </div>
          <div>Address</div>
        </Headers>
        <List>
          {identities.map(({ address, name }) => (
            <Item key={address}>
              <Label>
                {!iOS && (
                  <StyledCheckbox
                    checked={addressesSelected.get(address)}
                    onChange={onToggleAddress(address)}
                  />
                )}
                {name}
              </Label>
              <div>
                <IdentityBadge
                  entity={address}
                  popoverAction={{
                    label: 'Edit custom label',
                    onClick: updateLabel(address),
                  }}
                  popoverTitle={<LocalIdentityPopoverTitle label={name} />}
                />
              </div>
            </Item>
          ))}
        </List>
        <Controls>
          <Import onImport={onImport} />
          {!iOS && (
            <StyledExport
              label="Export labels"
              mode="secondary"
              download={`aragon-labels_${dao}_${today}.json`}
              href={someSelected ? downloadHref : undefined}
              disabled={!someSelected}
            >
              Export
            </StyledExport>
          )}
          <Button
            label="Remove labels"
            mode="outline"
            onClick={() => setOpened(true)}
          >
            <IconCross /> Remove all labels
          </Button>
          <Modal visible={opened} onClose={() => setOpened(true)}>
            <ModalTitle>Remove labels</ModalTitle>
            <ModalText>
              This action will irreversibly delete the selected labels you have
              added to your organization on this device
            </ModalText>
            <ModalControls>
              <Button
                label="Cancel"
                mode="secondary"
                onClick={() => setOpened(false)}
              >
                Cancel
              </Button>
              <RemoveButton
                label="Remove labels"
                mode="strong"
                onClick={onClearAll}
              >
                Remove
              </RemoveButton>
            </ModalControls>
          </Modal>
        </Controls>
        <Warning />
      </React.Fragment>
    )
  }
)

LocalIdentities.propTypes = {
  addressesSelected: PropTypes.instanceOf(Map).isRequired,
  dao: PropTypes.string.isRequired,
  identities: PropTypes.array.isRequired,
  onClearAll: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onModify: PropTypes.func.isRequired,
  onModifyEvent: PropTypes.func,
  onToggleAddress: PropTypes.func.isRequired,
  onToggleAll: PropTypes.func.isRequired,
  opened: PropTypes.bool.isRequired,
  setOpened: PropTypes.bool.isRequired,
}

LocalIdentities.defaultProps = {
  onModifyEvent: () => null,
}

const ModalTitle = styled.h1`
  font-size: 22px;
`

const ModalText = styled.p`
  margin: ${2.5 * GU}px 0 ${2.5 * GU}px 0;
`

const ModalControls = styled.div`
  display: grid;
  grid-gap: ${1.5 * GU}px;
  grid-template-columns: 1fr 1fr;

  ${breakpoint(
    'medium',
    `
      display: flex;
      justify-content: flex-end;
    `
  )}
`

const StyledCheckbox = styled(Checkbox)`
  margin-right: ${3 * GU}px;
`

const RemoveButton = styled(Button)`
  ${breakpoint(
    'medium',
    `
      margin-left: ${2.5 * GU}px;
    `
  )}
`

const Label = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Warning = React.memo(() => (
  <StyledInfoAction title="All labels are local to your device">
    <div>
      Any labels you add or import will only be shown on this device, and not
      stored anywhere else. If you want to share the labels with other devices
      or users, you will need to export them and share the .json file
    </div>
  </StyledInfoAction>
))

const StyledExport = styled(Button.Anchor)`
  margin: 0 ${3 * GU}px ${3 * GU}px;
`

const Controls = styled.div`
  display: flex;
  align-items: start;
  flex-wrap: wrap;
  margin-top: ${2.5 * GU}px;
  padding: 0 ${2 * GU}px;

  ${breakpoint(
    'medium',
    `
      padding: 0;
    `
  )}
`

const StyledInfoAction = styled(Info.Action)`
  margin: ${2 * GU}px ${2 * GU}px 0 ${2 * GU}px;

  ${breakpoint(
    'medium',
    `
      margin: 0;
      margin-top: ${2 * GU}px;
    `
  )}
`

const Headers = styled.div`
  margin: ${1.5 * GU}px auto;
  text-transform: uppercase;
  color: ${theme.textSecondary};
  ${font({ size: 'xsmall' })};
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;

  & > div {
    padding-left: ${2 * GU}px;
  }
`

const Item = styled.li`
  padding: ${2 * GU}px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  border-bottom: 1px solid ${theme.contentBorder};

  & > div {
    padding-left: ${2 * GU}px;
  }
`

const List = styled.ul`
  padding: 0;
  list-style: none;
  overflow: hidden;

  li:first-child {
    border-top: 1px solid ${theme.contentBorder};
  }

  ${breakpoint(
    'medium',
    `
      max-height: 50vh;
      overflow: auto;
      border-radius: 4px;
      border: 1px solid ${theme.contentBorder};

      li:first-child {
        border-top: none;
      }
      li:last-child {
        border-bottom: none;
      }
    `
  )}
`

export default SelectableLocalIdentities
