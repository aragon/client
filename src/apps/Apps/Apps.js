import React from 'react'
import styled from 'styled-components'
import { DropDown, Button, Field, TextInput } from '@aragon/ui'
import ComingSoon from '../../components/ComingSoon/ComingSoon'
import { AppBar } from '@aragon/ui'
import { Text, theme } from '@aragon/ui'
import AppLayout from '../../components/AppLayout/AppLayout'
import logo from '../../components/Home/assets/logo-background.svg'

class Apps extends React.Component {
  render() {
    return (
      <ComingSoon
        title='Apps'
        subtitle='The ability to install apps is not ready yet'
        endContent={
          <Button.Anchor mode="strong" href="https://hack.aragon.org/" target="_blank">
            Create a new app
          </Button.Anchor>
        }>
        <br/>
        <p>In this screen, you will be able to <b>browse</b> and <b>install</b> apps for your Aragon organization</p>
        <p>In the meantime, you can <a href="https://hack.aragon.org/" target="_blank">learn how to create apps</a> if you are a developer</p>
      </ComingSoon>
    )
  }
}

export default Apps