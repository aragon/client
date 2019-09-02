import React, { useCallback } from 'react'
import { CardLayout, GU, Info, Link, Tag, useLayout } from '@aragon/ui'
import { appsInDevelopment } from './discover-apps-data'
import AppCard from '../AppCard'
import AppIcon from '../../../components/AppIcon/AppIcon'

const DiscoverApps = React.memo(function DiscoverApps() {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  const rowHeight = compactMode ? 148 : 294
  const columnWidthMin = compactMode ? 328 : 30 * GU
  const handleClick = useCallback(link => {
    if (link) {
      window.open(link, '_blank', 'noopener')
    }
  }, [])

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
        {appsInDevelopment.map(
          ({ link, icon, name, status, description }, i) => (
            <AppCard
              key={i}
              onClick={handleClick}
              link={link}
              icon={<AppIcon size={9 * GU} src={icon} radius={12} />}
              name={name}
              tag={<Tag mode="indicator">{status}</Tag>}
              description={description}
            />
          )
        )}
      </CardLayout>
    </React.Fragment>
  )
})

export default DiscoverApps
