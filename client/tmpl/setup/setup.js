// @flow
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { dispatcher } from '/client/lib/action-dispatcher'
import TxQueue from '/client/lib/queue'
import { CompanyFactory, CompanyConfiguratorFactory } from '/client/lib/ethereum/contracts'

const tmpl = Template.Setup

tmpl.onCreated(() => {
  const initialTmpl = (window.injectMetaMask) ? 'Setup_MetaMask' : 'Setup_Welcome'
  TemplateVar.set('step', initialTmpl)
})

tmpl.onRendered(() => {
  $('#inboxButton, a[href="/account"]').hide()
  $('#pendingTxButton').popup({
    inline: true,
    on: 'click',
    position: 'bottom center',
  })
})

const setupFinished = companyAddress => {
  localStorage.setItem('companyAddress', companyAddress)
  location.reload()
}

const configureCompany = async companyAddress => {
  const companyConfiguratorFactory = await CompanyConfiguratorFactory.deployed()
  const txID = await dispatcher.performTransaction(companyConfiguratorFactory.configureCompany, companyAddress, dispatcher.transactionParams.from)
  TxQueue.addListener(txID, () => setupFinished(companyAddress))
}

tmpl.events({
  'click #createOrganization': async function() {
    const companyFactory = await CompanyFactory.deployed()

    await dispatcher.performTransaction(companyFactory.deployCompany)
    companyFactory.NewCompany({ deployer: dispatcher.transactionParams.from }).watch((err, ev) => {
      if (err) return console.error(err)
      configureCompany(ev.args.companyAddress)
    })
  },
  'click #joinOrganization': () => TemplateVar.set('step', 'Setup_JoinOrganization'),
})
