const { getSetting } = require('../core/config/settings.service');

async function calculateDispatchRadius(demand){

  const r1 = Number(await getSetting('dispatch_radius_step1')) || 3;
  const r2 = Number(await getSetting('dispatch_radius_step2')) || 6;
  const r3 = Number(await getSetting('dispatch_radius_step3')) || 10;
  const r4 = Number(await getSetting('dispatch_radius_step4')) || 15;

  let radius = r1;

  if(demand.bookings > demand.technicians){
    radius = r2;
  }

  if(demand.bookings > demand.technicians * 2){
    radius = r3;
  }

  if(demand.bookings > demand.technicians * 3){
    radius = r4;
  }

  return radius;

}

module.exports = { calculateDispatchRadius };
