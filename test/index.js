const { Orchestrator, tapeExecutor, Config, singleConductor, combine, callSync, localOnly } = require('@holochain/tryorama')

const MIN_EXPECTED_SCENARIOS = 1

process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.error('got unhandledRejection:', error);
});


let middleware = combine(
  // by default, combine conductors into a single conductor for in-memory networking
  // NB: this middleware makes a really huge difference! and it's not very well tested,
  // as of Oct 1 2019. So, keep an eye out.
  tapeExecutor(require('tape')),
  localOnly,
  callSync
);


const orchestrator = new Orchestrator({
    middleware,
    waiter: {
	softTimeout: 5000,
	hardTimeout: 10000,
    }
})

require('./single_agent_tests/categories_test')(orchestrator.registerScenario);
require('./single_agent_tests/happs_test')(orchestrator.registerScenario);
require('./single_agent_tests/whoami_test')(orchestrator.registerScenario);
require('./multi_agent_tests/upvote_test')(orchestrator.registerScenario);


// Check to see that we haven't accidentally disabled a bunch of scenarios
const num = orchestrator.numRegistered()
if (num < MIN_EXPECTED_SCENARIOS) {
  console.error(`Expected at least ${MIN_EXPECTED_SCENARIOS} scenarios, but only ${num} were registered!`)
  process.exit(1)
}
else {
  console.log(`Registered ${num} scenarios (at least ${MIN_EXPECTED_SCENARIOS} were expected)`)
}

orchestrator.run().then(stats => {
  console.log("All done.")
})
