import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  AppBar,
  AppView,
  BREAKPOINTS,
  Button,
  ButtonIcon,
  Checkbox,
  IconClose,
  IdentityBadge,
  breakpoint,
  font,
  theme,
  useViewport,
} from '@aragon/ui'
import {
  IdentityContext,
  identityEventTypes,
} from '../IdentityManager/IdentityManager'
import { AragonType } from '../../prop-types'
import { GU } from '../../utils'

const QUERY_VAR = '?labels='

const SaveLocalIdentities = ({ dao, wrapper, onSave }) => {
  const { below } = useViewport()
  const smallView = below('medium')
  const { identityEvents$ } = React.useContext(IdentityContext)
  const [opened, setOpened] = React.useState(false)
  const [selected, setSelected] = React.useState(new Map())
  const [labels, setLabels] = React.useState([])
  const [allSelected, someSelected] = React.useMemo(
    () => [
      Array.from(selected.values()).every(Boolean),
      Array.from(selected.values()).some(Boolean),
    ],
    [selected]
  )
  const onToggleAll = React.useCallback(
    () =>
      setSelected(
        new Map(
          labels.map(({ address }) => [address, !(allSelected || someSelected)])
        )
      ),
    [labels, allSelected, someSelected]
  )
  const onToggleAddress = React.useCallback(
    address => () =>
      setSelected(new Map([...selected, [address, !selected.get(address)]])),
    [selected]
  )
  const handleExit = React.useCallback(
    () => (window.location.hash = `#/${dao}`)
  )
  const handleClose = React.useCallback(() => {
    setOpened(false)
    handleExit()
  })
  const labelsIndex = React.useMemo(
    () => window.location.hash.indexOf(QUERY_VAR),
    [window.location.hash]
  )
  const handleSave = React.useCallback(async () => {
    if (!wrapper) {
      return
    }
    await wrapper.clearLocalIdentities()
    const list = labels.filter(({ address }) => selected.get(address))
    for (const { name, address } of list) {
      await wrapper.modifyAddressIdentity(address, { name })
    }
    identityEvents$.next({ type: identityEventTypes.IMPORT })
    handleExit()
    onSave()
  }, [wrapper, labels, selected])

  React.useEffect(() => {
    if (labelsIndex < 0) {
      return
    }
    const raw = window.decodeURI(
      atob(window.location.hash.substr(labelsIndex + QUERY_VAR.length))
    )
    try {
      setLabels(JSON.parse(raw))
    } catch (e) {
      console.warn('There was an error parsing the label data: ', e)
    }
  }, [labelsIndex])
  React.useEffect(() => {
    if (wrapper && labels.length) {
      setOpened(true)
    }
  }, [wrapper, labels])
  React.useEffect(() => {
    setSelected(new Map(labels.map(({ address }) => [address, true])))
  }, [labels])

  if (!opened || !labels.length) {
    return null
  }

  return (
    <Wrap style={{ zIndex: smallView ? 2 : 5 }}>
      <AppView
        smallView={smallView}
        padding={0}
        appBar={
          <StyledAppBar>
            <Title>Save Labels</Title>
            <CloseButton onClick={handleClose} />
          </StyledAppBar>
        }
      >
        <Section>
          <Content>
            <h2
              css={`
                font-weight: bold;
                font-size: 16px;
                line-height: 25px;
                padding: 0 ${2 * GU}px;
              `}
            >
              Save custom labels
            </h2>
            <div
              css={`
                margin-top: ${2 * GU}px;
                padding: 0 ${2 * GU}px;
                font-size: 15px;
                line-height: 22px;
              `}
            >
              These labels have been shared with you. By clicking on the 'Save'
              button, you’ll make them available in this device (labels will be
              stored locally).
            </div>
            <Headers style={{ marginTop: `${5 * GU}px` }}>
              <div>
                <StyledCheckbox
                  checked={allSelected}
                  onChange={onToggleAll}
                  indeterminate={!allSelected && someSelected}
                />
                Custom label
              </div>
              <div
                css={`
                  padding-right: ${2 * GU}px;
                  text-align: right;

                  ${breakpoint(
                    'medium',
                    `
                      text-align: left;
                    `
                  )}
                `}
              >
                <span
                  css={`
                    display: inline-block;
                    width: 138.65px;
                    text-align: left;
                  `}
                >
                  Address
                </span>
              </div>
            </Headers>
            <List>
              {labels.map(({ address, name }) => (
                <Item key={address}>
                  <Label>
                    <StyledCheckbox
                      checked={selected.get(address)}
                      onChange={onToggleAddress(address)}
                    />
                    {name}
                  </Label>
                  <div
                    css={`
                      padding-right: ${2 * GU}px;
                      text-align: right;

                      ${breakpoint(
                        'medium',
                        `
                          text-align: left;
                        `
                      )}
                    `}
                  >
                    <IdentityBadge entity={address} />
                  </div>
                </Item>
              ))}
            </List>
            <Controls>
              <Button
                label="Cancel"
                mode="secondary"
                onClick={handleClose}
                css={'width: 117px;'}
              >
                Cancel
              </Button>
              <Button
                label="Save"
                mode="strong"
                disabled={!someSelected}
                onClick={handleSave}
                css={`
                  width: 117px;

                  ${breakpoint(
                    'medium',
                    `
                      margin-left: ${2 * GU}px;
                    `
                  )}
                `}
              >
                Save
              </Button>
            </Controls>
          </Content>
        </Section>
      </AppView>
    </Wrap>
  )
}

SaveLocalIdentities.propTypes = {
  dao: PropTypes.string.isRequired,
  wrapper: AragonType,
  onSave: PropTypes.func.isRequired,
}

const Wrap = styled.div`
  position: fixed;
  background: #fff;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  min-width: 320px;
`

const StyledAppBar = styled(AppBar)`
  padding-left: ${2 * GU}px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${breakpoint(
    'medium',
    `
      padding-left: 0;
    `
  )}
`

const Title = styled.h1`
  ${font({ size: 'xxlarge' })};

  ${breakpoint(
    'medium',
    `
      /* half screen width minus half max container width */
      margin-left: calc(100vw / 2 - ${BREAKPOINTS.medium / 2}px);
    `
  )}
`

const Section = styled.section`
  padding: ${2 * GU}px 0;

  ${breakpoint(
    'medium',
    `
      width: ${BREAKPOINTS.medium}px;
      margin: 0 auto;
    `
  )}
`

const Content = styled.main`
  padding-top: ${2 * GU}px;
`

const CloseButton = styled(ButtonIcon).attrs({
  children: <IconClose />,
  label: 'Close',
})`
  width: auto;
  height: 100%;
  padding: 0 ${2 * GU}px;

  ${breakpoint(
    'medium',
    `
      /* half screen width minus half max container width */
      margin-right: calc(100vw / 2 - ${BREAKPOINTS.medium / 2}px);
    `
  )}
`

const StyledCheckbox = styled(Checkbox)`
  margin-right: ${3 * GU}px;
`

const Label = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${2.5 * GU}px;
  padding: 0 ${2 * GU}px;

  ${breakpoint(
    'medium',
    `
      display: block;
      padding: 0;
      text-align: right;
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

export default SaveLocalIdentities
