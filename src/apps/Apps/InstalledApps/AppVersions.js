import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Trail, animated } from 'react-spring'
import { Badge, theme, springs } from '@aragon/ui'
import { format } from 'date-fns'
import { TextLabel } from '../../../components/TextStyles'
import { GU } from '../../../utils'

const AppVersions = ({ version, versions, animate }) => (
  <div
    css={`
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    `}
  >
    <table
      css={`
        border-collapse: collapse;
        width: 100%;
      `}
    >
      <thead>
        <tr
          css={`
            th {
              border-bottom: 1px solid ${theme.contentBorder};
            }
          `}
        >
          <Td as="th">
            <TextLabel>App version</TextLabel>
          </Td>
          <Td as="th">
            <TextLabel>Release date</TextLabel>
          </Td>
        </tr>
      </thead>
      <tbody>
        <Trail
          items={versions}
          keys={v => v.name}
          from={{ progress: 0 }}
          to={{ progress: 1 }}
          config={springs.smooth}
          delay={150}
          immediate={!animate}
          native
        >
          {({ name, date }) => ({ progress }) => (
            <BodyTr
              key={name}
              style={{
                opacity: progress,
                transform: progress.interpolate(
                  v => `translate3d(${10 * (1 - v)}%, 0, 0)`
                ),
              }}
            >
              <Td>
                {name}{' '}
                {name === version && (
                  <Badge.Identity
                    style={{ marginLeft: `${GU}px`, fontVariant: 'small-caps' }}
                  >
                    current
                  </Badge.Identity>
                )}
              </Td>
              <Td>{format(date, 'dd/MM/yy')}</Td>
            </BodyTr>
          )}
        </Trail>
      </tbody>
    </table>
  </div>
)

AppVersions.propTypes = {
  version: PropTypes.string.isRequired,
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      date: PropTypes.instanceOf(Date).isRequired,
    })
  ).isRequired,
  animate: PropTypes.bool,
}

const BodyTr = styled(animated.tr)`
  &:first-child td {
    padding-top: 8px;
  }
`

const Td = styled.td`
  padding: 3px 0;
  text-align: right;
  &:first-child {
    text-align: left;
  }
`

export default AppVersions
