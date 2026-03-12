const os = require('os');
const { getSetting } = require('../core/config/settings.service');

async function runAutoScaling(){

  const enabled = await getSetting('auto_scaling_enabled');

  if(!enabled){
    return;
  }

  const cpuThreshold =
    Number(await getSetting('auto_scaling_cpu_threshold')) || 70;

  const memoryThreshold =
    Number(await getSetting('auto_scaling_memory_threshold')) || 75;

  const cpuLoad = os.loadavg()[0] * 100;
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMemPercent = ((totalMem - freeMem) / totalMem) * 100;

  if(cpuLoad > cpuThreshold){
    console.log("⚡ High CPU load detected:", cpuLoad);
  }

  if(usedMemPercent > memoryThreshold){
    console.log("⚡ High Memory usage detected:", usedMemPercent);
  }

}

module.exports = { runAutoScaling };
