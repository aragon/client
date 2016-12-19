import ClosableSection from '/client/tmpl/components/closableSection'

const tmpl = Template.Module_Fundraising_Info.extend([ClosableSection])

tmpl.helpers({
  raise: {
    name: 'Seed round',
    amount: 1000,
    isClosed: false,
    closingTime: moment().subtract(1, 'year').toDate(),
  },
})
