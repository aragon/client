export default {
  parent: () => ({ parent: Template.instance() }),
  $contains: (a, b) => (!a || b.toLowerCase().indexOf(a.toLowerCase()) !== -1),
}
