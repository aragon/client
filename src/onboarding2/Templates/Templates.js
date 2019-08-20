import React from 'react'
import { GU } from '@aragon/ui'
import Carousel from '../../components/Carousel/Carousel'
import templates from '../../templates'
import TemplateCard from './TemplateCard'
import Header from '../Header/Header'

function Templates() {
  return (
    <div
      css={`
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <Header
        title="Choose a template"
        subtitle="Create your own organisation and token in a few minutes!"
        bottomSpacing={3 * GU}
      />
      <div
        css={`
          flex-grow: 1;
          width: 100%;
          display: flex;
          align-items: center;
          padding-bottom: ${3 * GU}px;
        `}
      >
        <Carousel
          itemWidth={38 * GU}
          itemHeight={48 * GU}
          itemSpacing={3 * GU}
          items={templates.map(template => (
            <TemplateCard template={template} key={template.id} />
          ))}
        />
      </div>
    </div>
  )
}

export default Templates
