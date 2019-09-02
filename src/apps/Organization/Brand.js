import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import {
  Box,
  Button,
  DropDown,
  GU,
  Info,
  Text,
  TextInput,
  useTheme,
} from '@aragon/ui'
import organizationLogoPlaceholder from '../../assets/organization-logo-placeholder.png'
import organizationBackground from '../../assets/organization-background.png'
import Label from './Label'

const Brand = () => {
  const theme = useTheme()
  const [accentColor, setAccentColor] = useState('')
  const [preferredTheme, setPreferredTheme] = useState(0)
  const changePreferredTheme = index => setPreferredTheme(index)
  const changeAccentColor = e => setAccentColor(e.target.value)
  const saveColors = () => {
    console.log('save accent color:', accentColor, 'theme:', preferredTheme)
  }
  const colorRX = /^#(([a-f0-9]{3}){1,2})$/i
  const colorError = accentColor && !colorRX.test(accentColor)

  return (
    <Box padding={3 * GU} heading="Brand">
      <div css="display: flex; width: 100%">
        <div css="display: flex; flex-direction: column; width: 50%; padding-right: 12px">
          <Label text="Logo" />

          <div css="margin-bottom: 20px">
            <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div {...getRootProps()} css="outline: none">
                  <input {...getInputProps()} />
                  <div
                    css={`
                      background: ${theme.surfaceUnder};
                      width: 217px;
                      height: 217px;
                      padding: 30px;
                      margin-bottom: 10px;
                      border: ${isDragActive
                        ? '1px dashed green'
                        : '1px solid white'};
                    `}
                  >
                    <img
                      css={`
                        width: 157px;
                        height: 157px;
                        border: 0;
                        border-radius: 50%;
                      `}
                      src={organizationLogoPlaceholder}
                      alt=""
                    />
                  </div>
                  <Button
                    mode="outline"
                    css="margin-right: 10px; font-weight: bold"
                  >
                    Upload new
                  </Button>
                  <Button mode="outline" css="font-weight: bold">
                    Revert to default
                  </Button>
                  <Text css="display: block; margin-top: 8px" size="small">
                    Please keep 1:1 ratio
                  </Text>
                </div>
              )}
            </Dropzone>
          </div>

          <Label text="Accent color hex" block>
            <TextInput
              css={`
                display: block;
                border: 1px solid ${colorError ? 'red' : '#DDE4E9'};
              `}
              value={accentColor}
              onChange={changeAccentColor}
            />
          </Label>

          {colorError && (
            <Text css="margin-top: 3px" color="#F22" size="xsmall">
              Please use #123 or #123456 format
            </Text>
          )}

          <Info css="margin: 20px 0">
            When empty, the accent color sets itself to the default. Try adding
            a custom hex value and see the change reflected on the button below
            as a preview.
          </Info>
        </div>

        <div css="display: flex; flex-direction: column; width: 50%; padding-left: 12px">
          <Label text="Placeholder image" />

          <div css="margin-bottom: 20px">
            <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div {...getRootProps()} css="outline: none">
                  <input {...getInputProps()} />
                  <div
                    css={`
                      margin-bottom: 10px;
                      height: 217px;
                      border: ${isDragActive
                        ? '1px dashed green'
                        : '1px solid white'};
                    `}
                  >
                    <img
                      css="width: 321px; height: 217px"
                      src={organizationBackground}
                      alt=""
                    />
                  </div>
                  <Button
                    mode="outline"
                    css="margin-right: 10px; font-weight: bold"
                  >
                    Upload new
                  </Button>
                  <Button mode="outline" css="font-weight: bold">
                    Revert to default
                  </Button>
                </div>
              )}
            </Dropzone>
          </div>

          <Label text="Theme" block>
            <DropDown
              css="display: block"
              selected={preferredTheme}
              items={['Light Theme', 'Dark Theme']}
              onChange={changePreferredTheme}
            />
          </Label>
        </div>
      </div>
      <Button
        mode="strong"
        onClick={saveColors}
        css={`
          ${accentColor && !colorError && { background: accentColor }};
        `}
      >
        Save changes
      </Button>
      <Button mode="outline" css="margin-left: 10px; font-weight: bold">
        Reset brand
      </Button>
    </Box>
  )
}

export default Brand
