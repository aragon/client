// TODO: remove when upgrading to the next version of Aragon UI.
// From https://github.com/aragon/aragon-ui/blob/ec45bb4fc5d764879d473434719bea8517ff06c1/src/utils/styles/spring.js

export default {
  // Slow spring, can be used to move large things (e.g. a side panel).
  lazy: { mass: 1, tension: 120, friction: 20, precision: 0.01 },

  // Medium speed spring, can be used to move small objects.
  smooth: { mass: 0.7, tension: 300, friction: 25, precision: 0.01 },

  // Fast speed spring, for actions that need to feel almost instant.
  swift: { mass: 0.5, tension: 800, friction: 30, precision: 0.01 },
}
