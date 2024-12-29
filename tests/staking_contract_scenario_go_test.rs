use multiversx_sc_scenario::*;

fn world() -> ScenarioWorld {
    ScenarioWorld::vm_go()
}

#[test]
fn staking_contract_scenario_go_test() {
    world().run("scenarios/staking_contract.scen.json");
}
