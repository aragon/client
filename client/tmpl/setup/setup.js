// @flow
import { Template } from 'meteor/templating'
import { TemplateVar } from 'meteor/frozeman:template-var'
import { dispatcher } from '/client/lib/action-dispatcher'
import TxQueue from '/client/lib/queue'
import { CompanyFactory, CompanyConfiguratorFactory } from '/client/lib/ethereum/contracts'

const tmpl = Template.Setup

tmpl.onCreated(() => {
  TemplateVar.set('step', 'Setup_Welcome')
})

tmpl.onRendered(() => {
  $('#pendingTxButton').popup({
    inline: true,
    on: 'click',
    position: 'bottom center',
  })
})

tmpl.events({
  'click #createOrganization': async () => {
    const companyFactory = await CompanyFactory.deployed()
    const r = await companyFactory.deploy(dispatcher.transactionParams)
    const companyAddress = r.logs.filter(e => e.event === 'NewCompany')[0].args.companyAddress
    const companyConfiguratorFactory = await CompanyConfiguratorFactory.deployed()
    const txID = await dispatcher.performTransaction(companyConfiguratorFactory.configureCompany, companyAddress)
    console.log(txID)
    this.autorun(() => {
      const queue = TxQueue.queue.get()
      const txInQueue = queue.filter((tx) => {
        console.log(tx)
        return (tx.txID !== txID)
      })
      console.log(txInQueue)
    })
    localStorage.setItem('companyAddress', companyAddress)
    location.reload()
  },
  'click #joinOrganization': () => TemplateVar.set('step', 'Setup_JoinOrganization'),
})
