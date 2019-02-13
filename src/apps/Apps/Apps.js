import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
  Badge,
  Button,
  Card,
  SafeLink,
  Text,
  breakpoint,
  colors,
  theme,
  unselectable,
} from '@aragon/ui'
import AppLayout from '../../components/AppLayout/AppLayout'

import defaultIcon from './icons/default.svg'
import payrollIcon from './icons/payroll.svg'
import espressoIcon from './icons/espresso.svg'

class Apps extends React.Component {
  static propTypes = {
    onMessage: PropTypes.func.isRequired,
  }

  handleMenuPanelOpen = () => {
    this.props.onMessage({
      data: { from: 'app', name: 'menuPanel', value: true },
    })
  }

  render() {
    return (
      <AppLayout
        title="Apps"
        onMenuOpen={this.handleMenuPanelOpen}
        mainButton={{
          button: (
            <DevPortalAnchor
              mode="strong"
              href="https://hack.aragon.org/"
              target="_blank"
            >
              Create a new app
            </DevPortalAnchor>
          ),
        }}
        smallViewPadding={20}
      >
        <Content>
          <p>
            Soon you will be able to <em>browse</em> and <em>install</em> apps
            in your Aragon organization from here.
          </p>
          <p>
            In the meantime, you can{' '}
            <SafeLink href="https://hack.aragon.org/" target="_blank">
              learn how to create apps
            </SafeLink>{' '}
            or preview some of the apps being developed.
          </p>

          <h1>Apps in development</h1>
          <AppsGrid>
            {knownApps.map((app, i) => (
              <Main key={i}>
                <Icon>
                  <Img width="64" height="64" src={app.icon} alt="" />
                </Icon>
                <Name>{app.name}</Name>
                <TagWrapper>
                  <Tag background={statuses[app.status]}>{app.status}</Tag>
                </TagWrapper>
                <Description color={theme.textSecondary}>
                  {app.description}
                </Description>
                <Action href={app.link} target="_blank">
                  <Text weight="bold" color={theme.textSecondary}>
                    Read more
                  </Text>
                </Action>
              </Main>
            ))}
          </AppsGrid>
        </Content>
      </AppLayout>
    )
  }
}

const DevPortalAnchor = styled(Button.Anchor)`
  margin-right: 20px;
  display: block;
`

const Content = styled.div`
  > h1 {
    margin: 30px 0;
    font-weight: 600;
  }
`

const AppsGrid = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 25px;
  justify-items: start;
  grid-template-columns: 1fr;

  ${breakpoint(
    'medium',
    `
      grid-template-columns: repeat(auto-fill, 224px);
    `
  )};
`

const Main = styled(Card).attrs({ width: '100%', height: '288px' })`
  ${unselectable};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 25px;
`

const Icon = styled.div`
  height: 64px;
  margin-bottom: 5px;
  img {
    display: block;
  }
`

const Img = styled.img`
  display: block;
`

const Name = styled.p`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: 10px;
`

const TagWrapper = styled.div`
  max-width: 100%;
  padding: 0 20px;
  margin-bottom: 10px;
`

const Tag = styled(Badge)`
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  color: white;
`

const Description = styled(Text)`
  padding: 0 1rem;
  margin-bottom: 30px;
  text-align: center;
`

const Action = styled(SafeLink)`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-bottom: 30px;
  text-align: center;
  text-decoration: none;
`

const statuses = {
  'pre-alpha': colors.Gold.Brandy,
  alpha: colors.Blue.Danube,
  ready: colors.Green['Spring Green'],
}

const knownApps = [
  {
    icon: defaultIcon,
    name: 'That Planning Suite',
    status: 'alpha',
    description: `Suite for open and fluid organizations.
                  Bounties, range voting, and more.`,
    link: 'https://github.com/spacedecentral/planning-suite',
  },
  {
    icon: payrollIcon,
    name: 'Payroll',
    status: 'alpha',
    description: `Pay and get paid, by the block.
                  Supports tokens and price feeds.`,
    link:
      'https://github.com/aragon/aragon-apps/tree/master/future-apps/payroll',
  },
  {
    icon: espressoIcon,
    name: 'Espresso',
    status: 'pre-alpha',
    description: `Collaborative data vault.
                  Encrypt and share data with people in your organization.`,
    link: 'https://github.com/espresso-org',
  },
  {
    icon: defaultIcon,
    name: 'Liquid democracy',
    status: 'pre-alpha',
    description: `Delegate your voting power to others,
                  and vote on important matters.`,
    link: 'https://github.com/aragonlabs/liquid-democracy',
  },
]

export default Apps
