import React, { useCallback } from 'react'
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
  const rowHeight = compactMode ? 148 : 294
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
          external
        >
          CLI guide
        </Link>{' '}
        and learn{' '}
        <Link href="https://hack.aragon.org/docs/tutorial" external>
          how to create apps yourself.
        </Link>{' '}
        You can also preview some of the apps being developed.
      </Info>
      <CardLayout columnWidthMin={columnWidthMin} rowHeight={rowHeight}>
        {appsInDevelopment.map((app, i) => (
          <AppCard key={i} app={app} compactMode={compactMode} />
        ))}
      </CardLayout>
    </React.Fragment>
  )
})

function AppCard({ app, compactMode, onOpen, ...props }) {
  const theme = useTheme()
  const { link, icon, name, status, description } = app
  const handleClick = useCallback(() => {
    if (link) {
      window.open(link, '_blank', 'noopener')
    }
  }, [link])

  return (
    <Card onClick={handleClick} css='flex-direction: column;'>
      <CardMain compactMode={compactMode}>
        <StyledIconExternal
          compactMode={compactMode}
          theme={theme}
          link={link}
        />
        <Icon compactMode={compactMode}>
          <AppIcon size={9 * GU} src={icon} radius={12} />
        </Icon>
        <Name compactMode={compactMode}>{name}</Name>
        <TagWrapper compactMode={compactMode} link={link}>
          <Tag mode="indicator">{status}</Tag>
        </TagWrapper>
        <Description theme={theme} compactMode={compactMode}>
          {description}
        </Description>
      </CardMain>
    </Card>
  )
}

const CardMain = styled.section`
  ${unselectable};
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  white-space: initial;

  ${({ compactMode }) =>
    compactMode
      ? `
          display: grid;
          grid-template-columns: auto 1fr auto;
          grid-template-rows: auto auto auto;
          grid-template-areas:
            "empty topright"
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
  ${({ compactMode, link }) =>
    compactMode
      ? `
        grid-area: topright;
        text-align: right;
        position: absolute;
        right: ${link ? 3.5 * GU : 0}px;
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
  text-align: left;

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

const StyledIconExternal = styled(IconExternal)`
  visibility: ${({ link }) => (link ? 'visible' : 'hidden')};
  color: ${({ theme }) => theme.surfaceIcon};
  ${({ compactMode }) =>
    compactMode
      ? `
          grid-area: topright;
          margin-left: auto;
        `
      : `
          position: absolute;
          top: ${2 * GU}px;
          right: ${2 * GU}px;
        `};
`

export default DiscoverApps
