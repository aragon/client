import React from 'react'
import PropTypes from 'prop-types'
import { noop, RadioGroup } from '@aragon/ui'
import RadioCardItem from './RadioCardItem'

function RadioCardList({ items, onChange, selected, ...props }) {
  return (
    <div {...props}>
      <RadioGroup
        onChange={onChange}
        selected={selected}
        css={`
          display: flex;
          flex-direction: column;
        `}
      >
        {items.map(({ description, illustration, helpText, title }, i) => (
          <RadioCardItem
            key={i}
            description={description}
            illustration={illustration}
            index={i}
            helpText={helpText}
            title={title}
          />
        ))}
      </RadioGroup>
    </div>
  )
}

RadioCardList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      helpText: PropTypes.string,
      illustration: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
  onChange: PropTypes.func,
  selected: ({ items, selected }, _, componentName) => {
    if (!Number.isInteger(selected) || selected >= items.length) {
      throw new Error(
        `Invalid prop \`selected\` supplied to \`${componentName}\`. ` +
          '`selected` must be an integer less than the length of `items`. ' +
          `Given ${selected} instead.`
      )
    }
  },
}

RadioCardList.defaultProps = {
  items: [],
  onChange: noop,
  selected: 0,
}

export default RadioCardList
