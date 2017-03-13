// @flow
import { Template } from 'meteor/templating'

const tmpl = Template.Setup_Welcome

tmpl.onRendered(function () {
  this.$('#createOrganization').popup({
    position: 'top center',
  })
})
