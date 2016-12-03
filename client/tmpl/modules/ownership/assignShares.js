import Keybase from '/client/lib/keybase'
import ClosableSection from '/client/tmpl/elements/closableSection'

const tmpl = Template.module_ownershipAssignShares
ClosableSection.bind(tmpl, 'rightSection', 'module_ownershipEmpty')

tmpl.rendered = () => {
  // I don't like this
  const tmplIns = Template.instance()

  this.$('.dropdown').dropdown()
  this.$('.form').form({
    onSuccess: (e) => {
      e.preventDefault()
      this.$('.dimmer').dimmer('show')
      TemplateVar.set(tmplIns, 'processState', 'loading')
      setTimeout(() => {
        TemplateVar.set(tmplIns, 'processState', 'success')
      }, 2000)
      return false
    },
  })
}

tmpl.helpers({
  selectedReceiver: () => (TemplateVar.getFrom('#el_keybase', 'user')),
  addressForUser: ReactivePromise(Keybase.getEthereumAddress),
  processState: () => (TemplateVar.get('processState')),
})
