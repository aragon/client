import React from 'react'
import styled from 'styled-components'
import { AppBar, Button, DropDown, Field, TextInput, theme } from '@aragon/ui'
import Option from './components/Option'
import provideNetwork from '../../context/provideNetwork'

const currencies = ['USD'] // Keep to USD for now
const defaultCurrency = currencies[0]
const organizationAddress = '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be'

const Main = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
`

const StyledAppBar = styled(AppBar)`
  flex-shrink: 0;
`

const ScrollWrapper = styled.div`
  height: 100%;
  overflow: auto;
`

const Content = styled.div`
  width: 500px;
  padding: 30px;
`

const LinkButton = styled(Button.Anchor).attrs({
  compact: true,
  mode: 'outline',
})`
  background: ${theme.contentBackground};
`

class Settings extends React.Component {
  state = {
    selectedCurrency: defaultCurrency,
  }
  handleCurrencyChange = index => {
    // TODO: this should propagate to cache in aragon.js
    this.setState({
      selectedCurrency: currencies[index],
    })
  }
  render() {
    const { network } = this.props
    const { selectedCurrency } = this.state
    return (
      <Main>
        <StyledAppBar title="Your Settings" />
        <ScrollWrapper>
          <Content>
            <Option
              name="Organization Address"
              text={`This organization is deployed on the ${network.name}.`}
            >
              <Field label="Address:">
                <TextInput readOnly wide value={organizationAddress} />
              </Field>
              {network.etherscanBaseUrl && (
                <LinkButton
                  href={`${network.etherscanBaseUrl}/address/${organizationAddress}`}
                  target="_blank"
                >
                  See on Etherscan
                </LinkButton>
              )}
            </Option>
            <Option
              name="Currency"
              text="This will be the default currency for displaying purposes. It will be converted to ETH under the hood."
            >
              <Field label="Select currency">
                <DropDown
                  active={currencies.indexOf(selectedCurrency)}
                  items={currencies}
                  onChange={this.handleCurrencyChange}
                />
              </Field>
            </Option>
          </Content>
        </ScrollWrapper>
      </Main>
    )
  }
}

export default provideNetwork(Settings)
