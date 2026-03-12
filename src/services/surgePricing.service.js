const { getSetting } = require('../core/config/settings.service');

async function calculateSurge(demand, technicians){

  const surgeEnabled = await getSetting('surge_pricing_enabled');

  if(!surgeEnabled){
    return 1;
  }

  const t1 = Number(await getSetting('surge_threshold_level1')) || 1.2;
  const t2 = Number(await getSetting('surge_threshold_level2')) || 1.5;
  const t3 = Number(await getSetting('surge_threshold_level3')) || 2;

  const m1 = Number(await getSetting('surge_multiplier_level1')) || 1.2;
  const m2 = Number(await getSetting('surge_multiplier_level2')) || 1.5;
  const m3 = Number(await getSetting('surge_multiplier_level3')) || 2;

  const ratio = demand / Math.max(technicians,1);

  let multiplier = 1;

  if(ratio >= t1){
    multiplier = m1;
  }

  if(ratio >= t2){
    multiplier = m2;
  }

  if(ratio >= t3){
    multiplier = m3;
  }

  return multiplier;

}

module.exports = { calculateSurge };
