import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Section from '../Section'
import AppCard from '../AppCard'
import EmptyBlock from '../EmptyBlock'

class BrowseByApp extends React.Component {
  static propTypes = {
    apps: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    onOpenApp: PropTypes.func.isRequired,
  }

  render() {
    const { loading, apps, onOpenApp } = this.props
    return (
      <Section title="Browse by app">
        {(() => {
          if (loading) {
            return <EmptyBlock>Loading apps…</EmptyBlock>
          }
          if (apps.length === 0) {
            return <EmptyBlock>No apps installed.</EmptyBlock>
          }
          return (
            <Apps>
              {apps.map(app => (
                <AppCard key={app.proxyAddress} app={app} onOpen={onOpenApp} />
              ))}
            </Apps>
          )
        })()}
      </Section>
    )
  }
}

const Apps = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 25px;
  justify-items: start;
  grid-template-columns: repeat(auto-fill, 160px);
`

export default BrowseByApp
