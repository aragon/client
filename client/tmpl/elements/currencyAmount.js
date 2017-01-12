import { TemplateVar } from 'meteor/frozeman:template-var'
import fx from '/client/lib/currency'
import Settings from '/client/lib/settings'

const tmpl = Template.Element_CurrencyAmount

tmpl.onRendered(function() {
  setAmount(0)
})

const convertCurrency = amount => (
  web3.toWei(fx(amount).from(Settings.get('displayCurrency')).to('ETH'), 'ether')
)

const setAmount = amount => {
  TemplateVar.set('unconvertedAmount', amount)
  TemplateVar.set('amountWei', convertCurrency(amount))
}

tmpl.events({
  'input input': e => setAmount(parseFloat($(e.target).val())),
})
