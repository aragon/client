import React from 'react'
import styled from 'styled-components'
import {
  Button,
  Card,
  CardLayout,
  GU,
  Info,
  IconExternal,
  Link,
  Tag,
  textStyle,
  unselectable,
  useLayout,
  useTheme,
} from '@aragon/ui'
import { appsInDevelopment } from './discover-apps-data'
import AppIcon from '../../../components/AppIcon/AppIcon'

const DiscoverApps = React.memo(() => {
  const theme = useTheme()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  const rowHeight = compactMode ? null : 294

  return (
    <React.Fragment>
      <Info
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        You will soon be able to install new apps into your Aragon organization
        from here. In the meantime, you can use our{' '}
        <Link
          href="https://hack.aragon.org/docs/cli-dao-commands#dao-install"
          target="_blank"
        >
          CLI guide
        </Link>{' '}
        and learn{' '}
        <Link href="" target="_blank">
          how to create apps yourself.
        </Link>
        You can also preview some of the apps being developed.
      </Info>
      <CardLayout columnWidthMin={30 * GU} rowHeight={rowHeight}>
        {appsInDevelopment.map((app, i) => (
          <Main key={i} columnWidthMin={30 * GU} rowHeight={rowHeight}>
            {app.link && (
              <External href={app.link} target="_blank">
                <ExternalButton icon={<IconExternal />}>
                  <IconExternal size="tiny" />
                </ExternalButton>
              </External>
            )}
            <Icon>
              <AppIcon size={64} src={app.icon} />
            </Icon>
            <Name>{app.name}</Name>
            <TagWrapper>
              <Tag mode="indicator">{app.status}</Tag>
            </TagWrapper>
            <Description theme={theme}>{app.description}</Description>
          </Main>
        ))}
      </CardLayout>
    </React.Fragment>
  )
})

const Main = styled(Card)`
  ${unselectable};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: ${5 * GU}px;
`

const Icon = styled.div`
  height: ${9 * GU}px;
  margin-bottom: ${2 * GU}px;
  img {
    display: block;
  }
`

const Name = styled.p`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: ${1 * GU}px;
  ${textStyle('title4')}
`

const TagWrapper = styled.div`
  max-width: 100%;
  padding: 0 20px;
  margin-bottom: 10px;
`

const Description = styled.div`
  color: ${({ theme }) => theme.contentSecondary};
  padding: 0 1rem;
  text-align: center;
  ${textStyle('body2')};
  flex: 1;
`

const External = styled(Link)`
  position: absolute;
  top: ${2 * GU}px;
  right: ${2 * GU}px;
`

const ExternalButton = styled(Button)`
  width: ${3.5 * GU}px;
  height: ${3.5 * GU}px;
`

export default DiscoverApps
