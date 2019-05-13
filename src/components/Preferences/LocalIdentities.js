import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import {
  Button,
  Checkbox,
  IconCross,
  IdentityBadge,
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

    return (
      <LocalIdentities
        {...props}
        identities={identities}
        onToggleAll={handleToggleAll}
        onToggleAddress={handleToggleAddress}
        addressesSelected={addressesSelected}
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
    const handleDownload = React.useCallback(() => {
      // standard: https://en.wikipedia.org/wiki/ISO_8601
      const today = format(Date.now(), 'yyyy-MM-dd')
      const blob = new Blob(
        [
          JSON.stringify(
            identities.filter(({ address }) => addressesSelected.get(address))
          ),
        ],
        { type: 'text/json' }
      )
      saveAs(blob, `aragon-labels_${dao}_${today}.json`)
    }, [identities, addressesSelected])

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
              onClick={handleDownload}
              disabled={!someSelected}
            >
              Export
            </StyledExport>
          )}
          <Button mode="outline" onClick={onClearAll}>
            <IconCross /> Remove all labels
          </Button>
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
}

LocalIdentities.defaultProps = {
  onModifyEvent: () => null,
}

const StyledCheckbox = styled(Checkbox)`
  margin-right: ${3 * GU}px;
`

const Label = styled.label`
  display: block;
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

  & > label {
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
