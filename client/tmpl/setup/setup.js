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
    console.log(dispatcher.transactionParams)
    console.log(companyFactory.address)
    const r = await companyFactory.deployCompany(dispatcher.transactionParams)
    console.log(1)
    const companyAddress = r.logs.filter(e => e.event === 'NewCompany')[0].args.companyAddress
    console.log(2)
    const companyConfiguratorFactory = await CompanyConfiguratorFactory.deployed()
    console.log(3)
    const txID = await dispatcher.performTransaction(companyConfiguratorFactory.configureCompany, companyAddress)
    console.log(4)
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
