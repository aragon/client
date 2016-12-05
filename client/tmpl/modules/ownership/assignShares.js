import Keybase from '/client/lib/keybase'
import ClosableSection from '/client/tmpl/elements/closableSection'

const tmpl = Template.module_ownershipAssignShares
ClosableSection.bind(tmpl, 'rightSection', 'module_ownershipEmpty')

tmpl.rendered = () => {
  const parentTmplIns = Template.instance().data.parent
  const dimmer = this.$('.dimmer')

  this.$('.dropdown').dropdown()
  this.$('.form').form({
    onSuccess: (e) => {
      e.preventDefault()
      TemplateVar.setTo(dimmer, 'state', 'loading')
      setTimeout(() => {
        TemplateVar.setTo(dimmer, 'state', 'success')
        setTimeout(() => (TemplateVar.set(parentTmplIns, 'rightSection', 'module_ownershipEmpty')), 2500)
      }, 2500)
      return false
    },
  })
}

tmpl.helpers({
  selectedReceiver: () => (TemplateVar.getFrom('#el_keybase', 'user')),
  addressForUser: ReactivePromise(Keybase.getEthereumAddress),
})
