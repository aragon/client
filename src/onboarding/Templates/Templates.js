import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { GU } from '@aragon/ui'
import Carousel from '../../components/Carousel/Carousel'
import Header from '../Header/Header'
import TemplateCard from './TemplateCard'
import TemplateDetails from './TemplateDetails'

function Templates({ onUse, templates }) {
  const [templateDetailsOpened, setTemplateDetailsOpened] = useState(false)
  const [templateDetailsIndex, setTemplateDetailsIndex] = useState(0)

  const handleOpen = useCallback(
    id => {
      setTemplateDetailsIndex(templates.findIndex(t => t.id === id))
      setTemplateDetailsOpened(true)
    },
    [templates]
  )

  const handleDetailsClose = useCallback(() => {
    setTemplateDetailsOpened(false)
  }, [])

  const handleDetailsUse = useCallback(
    (id, optionalApps) => {
      setTemplateDetailsIndex(0)
      setTemplateDetailsOpened(false)
      onUse(id, optionalApps)
    },
    [onUse]
  )

  const selectedTemplate = templates[templateDetailsIndex]

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
        title="Select template"
        subtitle="Create your organization with our pre-configured templates"
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
        {templates.length > 0 && (
          <Carousel
            itemWidth={38 * GU}
            itemHeight={48 * GU}
            itemSpacing={3 * GU}
            items={templates.map(template => (
              <TemplateCard
                key={template.id}
                onOpen={handleOpen}
                template={template}
              />
            ))}
          />
        )}
      </div>
      <TemplateDetails
        onClose={handleDetailsClose}
        onUse={handleDetailsUse}
        template={selectedTemplate}
        visible={templateDetailsOpened}
      />
    </div>
  )
}

Templates.propTypes = {
  onUse: PropTypes.func.isRequired,
  templates: PropTypes.array.isRequired,
}

export default Templates
