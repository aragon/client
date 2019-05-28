import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Button, TextInput, DropDown } from '@aragon/ui'

import { EditTextField } from '../readOrEditFields'
import editImage from '../../assets/pencil-black-tool-interface-symbol.png'

export const AlignRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  cursor: pointer;
`

export const EditIcon = styled.img.attrs({ src: editImage })`
  width: 25px;
`

export const SmallMargin = styled.div`
  margin-top: 10px;
`

export const FlexDirectionRow = styled.div`
  display: flex;
  flex-direction: row;
`

export const FlexDirectionCol = styled.div`
  display: flex;
  flex-direction: column;
`

export const FullWidthButton = styled(Button)`
  width: 100%;
`

export const FullWidthTextInput = styled(EditTextField)`
  width: 100%;
`

export const FlexGrowTextInput = styled(EditTextField)`
  flex-grow: 1;
`

export const TextInputWithValidation = styled(TextInput)`
  border-color: ${props => (props.error ? 'red' : 'default')};
`

export const TextMultilineWithValidation = styled(TextInput.Multiline)`
  border-color: ${props => (props.error ? 'red' : 'default')};
`

export const Label = styled.div`
  text-transform: lowercase;
  font-variant: small-caps;
  color: #707070;
  margin: 0;
`

export const ErrorBar = styled.div`
  height: 1px;
  margin-top: 3px;
  width: 100%;
  background-color: red;
`

export const DropDownWithValidation = props => (
  <Fragment>
    <DropDown {...props} />
    {props.error && <ErrorBar />}
  </Fragment>
)

DropDownWithValidation.defaultProps = {
  error: '',
}
