import React, { useState, useCallback } from 'react'
import { GU } from '@aragon/ui'
import templates from '../../templates'
import Carousel from '../../components/Carousel/Carousel'
import Header from '../Header/Header'
import TemplateCard from './TemplateCard'
import TemplateDetails from './TemplateDetails'

function Templates({ onUse }) {
  const [templateDetailsOpened, setTemplateDetailsOpened] = useState(false)
  const [templateDetailsIndex, setTemplateDetailsIndex] = useState(0)

  const handleOpen = useCallback(id => {
    setTemplateDetailsIndex(templates.findIndex(t => t.id === id))
    setTemplateDetailsOpened(true)
  }, [])

  const handleDetailsClose = useCallback(() => {
    setTemplateDetailsOpened(false)
  }, [])

  const handleDetailsUse = useCallback(
    id => {
      setTemplateDetailsIndex(0)
      setTemplateDetailsOpened(false)
      onUse(id)
    },
    [onUse]
  )

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
        subtitle="Create your own organization and token in a few minutes!"
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
            <TemplateCard
              key={template.id}
              template={template}
              onOpen={handleOpen}
            />
          ))}
        />
      </div>

      <TemplateDetails
        onClose={handleDetailsClose}
        onUse={handleDetailsUse}
        template={templates[templateDetailsIndex] || null}
        visible={templateDetailsOpened}
      />
    </div>
  )
}

export default Templates
