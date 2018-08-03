import React from 'react'
import styled from 'styled-components'
import Section from '../Section'
import AppCard from '../AppCard'
import EmptyBlock from '../EmptyBlock'

class BrowseByApp extends React.Component {
  render() {
    const { loading, apps, onOpenApp } = this.props
    return (
      <Section title="Browse by app">
        {loading ? (
          <EmptyBlock>Loading apps…</EmptyBlock>
        ) : (
          <Apps>
            {apps.map(app => (
              <AppCard key={app.appId} app={app} onOpen={onOpenApp} />
            ))}
          </Apps>
        )}
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
