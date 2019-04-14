import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { format } from 'date-fns'
import {
  Button,
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

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

const LocalIdentities = ({
  dao,
  localIdentities,
  onClearAll,
  onImport,
  onModify,
  onModifyEvent,
}) => {
  // transform localIdentities from object into array and attach address to each entry
  const identities = Object.entries(localIdentities).map(
    ([address, identity]) => ({
      ...identity,
      address,
    })
  )

  if (!identities.length) {
    return <EmptyLocalIdentities onImport={onImport} />
  }

  const { identityEvents$ } = React.useContext(IdentityContext)
  const { showLocalIdentityModal } = React.useContext(LocalIdentityModalContext)
  const updateLabel = address => async () => {
    try {
      await showLocalIdentityModal(address)
      // preferences get all
      onModifyEvent()
      // for iframe apps
      identityEvents$.next({ type: identityEventTypes.MODIFY, address })
    } catch (e) {
      /* nothing was updated */
    }
  }
  const downloadHref = window.URL.createObjectURL(
    new Blob([JSON.stringify(identities)], { type: 'text/json' })
  )
  // standard: https://en.wikipedia.org/wiki/ISO_8601
  const today = format(Date.now(), 'yyyy-MM-dd')

  return (
    <React.Fragment>
      <Headers>
        <div>Custom label</div>
        <div>Address</div>
      </Headers>
      <List>
        {identities.map(({ address, name }) => (
          <Item key={address}>
            <Label>{name}</Label>
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
            href={downloadHref}
          >
            Export
          </StyledExport>
        )}
        <Button label="Remove labels" mode="outline" onClick={onClearAll}>
          <IconCross /> Remove all labels
        </Button>
      </Controls>
      <Warning />
    </React.Fragment>
  )
}

LocalIdentities.propTypes = {
  dao: PropTypes.string.isRequired,
  localIdentities: PropTypes.object,
  onClearAll: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  onModify: PropTypes.func.isRequired,
  onModifyEvent: PropTypes.func,
}

LocalIdentities.defaultProps = {
  localIdentities: {},
  onModifyEvent: () => null,
}

const Label = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Warning = () => (
  <StyledInfoAction title="All labels are local to your device">
    <div>
      Any labels you add or import will only be shown on this device, and not
      stored anywhere else. If you want to share the labels with other devices
      or users, you will need to export them and share the .json file
    </div>
  </StyledInfoAction>
)

const StyledExport = styled(Button.Anchor)`
  margin: 0 24px 24px;
`

const Controls = styled.div`
  display: flex;
  align-items: start;
  flex-wrap: wrap;
  margin-top: 20px;
  padding: 0 16px;

  ${breakpoint(
    'medium',
    `
      padding: 0;
    `
  )}
`

const StyledInfoAction = styled(Info.Action)`
  margin: 16px 16px 0 16px;

  ${breakpoint(
    'medium',
    `
      margin: 0;
      margin-top: 16px;
    `
  )}
`

const Headers = styled.div`
  margin: 10px auto;
  text-transform: uppercase;
  color: ${theme.textSecondary};
  ${font({ size: 'xsmall' })};
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;

  & > div {
    padding-left: 16px;
  }
`

const Item = styled.li`
  padding: 16px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  border-bottom: 1px solid ${theme.contentBorder};

  & > div {
    padding-left: 16px;
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

export default LocalIdentities
