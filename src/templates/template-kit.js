import React, { useCallback, useState } from 'react'
import {
  Button,
  Field,
  GU,
  IconArrowLeft,
  Info,
  Slider,
  TextInput,
  useTheme,
} from '@aragon/ui'
import Header from '../onboarding2/Header/Header'
import DomainField, {
  DOMAIN_CHECK,
  DOMAIN_NONE,
} from '../components/DomainField/DomainField'

function PercentageField({ label = 'Percentage', value, onChange }) {
  const handleSliderChange = useCallback(
    v => {
      onChange(Math.round(v * 100))
    },
    [onChange]
  )
  const handleInputChange = useCallback(
    event => {
      const value = parseInt(event.target.value, 10)
      if (!isNaN(value) && value >= 0 && value <= 100) {
        onChange(value)
      }
    },
    [onChange]
  )
  return (
    <Field label={label}>
      <div
        css={`
          display: flex;
          flex-direction: row;
        `}
      >
        <Slider
          value={value / 100}
          onUpdate={handleSliderChange}
          css={`
            flex-grow: 1;
            padding-left: 0;
            padding-right: 0;
            margin-right: ${3 * GU}px;
          `}
        />
        <TextInput
          value={`${value}%`}
          onChange={handleInputChange}
          css={`
            flex-grow: 0;
            flex-shrink: 0;
            width: ${12 * GU}px;
            text-align: center;
          `}
        />
      </div>
    </Field>
  )
}

function PrevNextFooter({
  onNext,
  onBack,
  nextEnabled = true,
  backEnabled = true,
  screens,
  screenIndex,
}) {
  const theme = useTheme()
  return (
    <div
      css={`
        display: flex;
        width: 100%;
        justify-content: space-between;
      `}
    >
      <Button
        disabled={!backEnabled}
        icon={
          <IconArrowLeft
            css={`
              color: ${theme.accent};
            `}
          />
        }
        label="Back"
        onClick={onBack}
      />
      <Button disabled={!nextEnabled} mode="strong" onClick={onNext}>
        Next: {screens[screenIndex + 1][0]}
      </Button>
    </div>
  )
}

function ClaimDomain({ back, data, fields, next, screenIndex, screens }) {
  const [domain, setDomain] = useState(data.domain || '')

  const handleNext = useCallback(() => {
    next({ domain })
  }, [domain, next])

  return (
    <div
      css={`
        display: grid;
        align-items: center;
        justify-content: center;
      `}
    >
      <div
        css={`
          max-width: ${82 * GU}px;
        `}
      >
        <Header
          title="Domain"
          subtitle="Create your own organisation and token in a few minutes!"
        />

        <DomainField
          label="Create your domain"
          onChange={setDomain}
          value={domain}
          status={domain ? DOMAIN_CHECK : DOMAIN_NONE}
        />

        <Info
          css={`
            margin-bottom: ${3 * GU}px;
          `}
        >
          Aragon uses the <strong>Ethereum Name Service (ENS)</strong> to assign
          names to organizations. The domain name you choose will be mapped to
          your organization’s Ethereum address and cannot be changed after you
          launch your organization.
        </Info>

        <PrevNextFooter
          backEnabled={true}
          nextEnabled={Boolean(domain)}
          onBack={back}
          onNext={handleNext}
          screenIndex={screenIndex}
          screens={screens}
        />
      </div>
    </div>
  )
}

// TODO
// <GenericSummary
//   entries={[{ type: 'app', id: '' }, { type: 'label', id: '' }]}
// />

export { PercentageField, ClaimDomain, Header, PrevNextFooter }
