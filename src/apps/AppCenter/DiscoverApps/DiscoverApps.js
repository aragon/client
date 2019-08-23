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
  const rowHeight = compactMode ? 168 : 294
  const columnWidthMin = compactMode ? 328 : 30 * GU

  return (
    <React.Fragment>
      <Info
        css={`
          margin: 0 ${compactMode ? 2 * GU : 0}px;
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
      <CardLayout columnWidthMin={columnWidthMin} rowHeight={rowHeight}>
        {appsInDevelopment.map((app, i) => (
          <Main key={i} compactMode={compactMode}>
            {app.link && (
              <ExternalButton
                compactMode={compactMode}
                href={app.link}
                target="_blank"
                icon={<IconExternal size="tiny" />}
              />
            )}
            <Icon compactMode={compactMode}>
              <AppIcon size={9 * GU} src={app.icon} radius={12} />
            </Icon>
            <Name compactMode={compactMode}>{app.name}</Name>
            <TagWrapper compactMode={compactMode}>
              <Tag mode="indicator">{app.status}</Tag>
            </TagWrapper>
            <Description theme={theme} compactMode={compactMode}>
              {app.description}
            </Description>
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
  height: 100%;
  width: 100%;

  ${({ compactMode }) =>
    compactMode
      ? `
          display: grid;
          grid-template-columns: auto 1fr;
          grid-template-rows: auto 1fr 1fr;
          grid-template-areas:
            "external tag"
            "icon title"
            "icon description";
          padding: ${1.5 * GU}px ${1.5 * GU}px ${4 * GU}px ${3 * GU}px;
        `
      : `
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: ${5 * GU}px;
        `}
`

const Icon = styled.div`
  height: ${9 * GU}px;
  width: ${9 * GU}px;
  ${({ compactMode }) =>
    compactMode
      ? `
        grid-area: icon;
        margin-right: ${1.5 * GU}px;
      `
      : `
        margin-bottom: ${2 * GU}px;
      `}
`

const Name = styled.p`
  display: flex;
  width: 100%;
  ${textStyle('title4')}
  ${({ compactMode }) =>
    compactMode
      ? `
        grid-area: title;
        align-self: flex-end;
      `
      : `
        justify-content: center;
        margin-bottom: ${1 * GU}px;
      `}
`

const TagWrapper = styled.div`
  ${({ compactMode }) =>
    compactMode
      ? `
        grid-area: tag;
        text-align: right;
      `
      : `
        max-width: 100%;
        padding: 0 ${2.5 * GU}px;
        margin-bottom: ${1 * GU}px;
      `}
`

const Description = styled.p`
  color: ${({ theme }) => theme.contentSecondary};
  ${textStyle('body2')};
  ${({ compactMode }) =>
    compactMode
      ? `
        grid-area: description;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        height: fit-content;
      `
      : `
        flex: 1;
        text-align: center;
        padding: 0 1rem;
      `}
`

const ExternalButton = styled(Button)`
  width: ${3.5 * GU}px;
  height: ${3.5 * GU}px;

  ${({ compactMode }) =>
    compactMode
      ? `
          grid-area: external;
        `
      : `
          position: absolute;
          top: ${2 * GU}px;
          right: ${2 * GU}px;
        `}
`

export default DiscoverApps
