const cron = require('node-cron');

/* ---------- CORE AI ENGINES ---------- */

const { runOptimizationEngine } =
require('./aiOptimizationEngine.service');

const { runRevenueAI } =
require('./aiRevenueEngine.service');

const { generateGrowthInsights } =
require('./aiGrowthAnalytics.service');

const { runPlatformBrain } =
require('./aiPlatformBrain.service');

const { runBusinessIntelligence } =
require('./aiBusinessIntelligence.service');

/* ---------- FRAUD ENGINE ---------- */

const fraudModule =
require('./fraudDetection.service');

const runFraudDetection =
fraudModule.runFraudDetection;

/* ---------- DEMAND AI ---------- */

const { forecastDemand } =
require('./demandForecast.service');

const { predictDemand } =
require('./demandPrediction.service');

const { runDemandHeatmap } =
require('./demandHeatmap.service');

/* ---------- DISPATCH LEARNING ---------- */

const { runDispatchLearning } =
require('./dispatchLearning.service');

/* ---------- TECHNICIAN REPUTATION ---------- */

const { runTechnicianReputation } =
require('./technicianReputation.service');

/* ---------- SURGE PRICING ---------- */

const { calculateSurge } =
require('./surgePricing.service');

/* ---------- SMART DISPATCH ---------- */

const { findBestTechnician } =
require('./smartDispatch.service');

/* ---------- MARKETPLACE CONTROLLER ---------- */

const { runMarketplaceController } =
require('./marketplaceController.service');

/* ---------- NEW ENGINES ---------- */

const { runReassignmentEngine } =
require('./aiReassignment.service');

const { runSLAMonitor } =
require('./slaMonitor.service');

let orchestratorStarted = false;

function startAIOrchestrator(){

if(orchestratorStarted){

console.log("⚠ AI Orchestrator already running");

return;

}

orchestratorStarted = true;

console.log("🤖 AI Orchestrator Started");

/* ---------- FRAUD ENGINE ---------- */

cron.schedule('* * * * *', async () => {

try{

await runFraudDetection();

}catch(err){

console.error(
"Fraud engine error",
err.message
);

}

});

/* ---------- OPTIMIZATION ENGINE ---------- */

cron.schedule('*/5 * * * *', async () => {

try{

await runOptimizationEngine();

}catch(err){

console.error(
"Optimization engine error",
err.message
);

}

});

/* ---------- GROWTH ENGINE ---------- */

cron.schedule('*/10 * * * *', async () => {

try{

await generateGrowthInsights();

}catch(err){

console.error(
"Growth engine error",
err.message
);

}

});

/* ---------- DEMAND HEATMAP ---------- */

cron.schedule('*/10 * * * *', async () => {

try{

await runDemandHeatmap();

}catch(err){

console.error(
"Heatmap error",
err.message
);

}

});

/* ---------- DEMAND FORECAST ---------- */

cron.schedule('*/20 * * * *', async () => {

try{

await forecastDemand();

}catch(err){

console.error(
"Demand forecast error",
err.message
);

}

});

/* ---------- DEMAND PREDICTION ---------- */

cron.schedule('*/15 * * * *', async () => {

try{

await predictDemand();

}catch(err){

console.error(
"Demand prediction error",
err.message
);

}

});

/* ---------- DISPATCH LEARNING ---------- */

cron.schedule('*/8 * * * *', async () => {

try{

await runDispatchLearning();

}catch(err){

console.error(
"Dispatch learning error",
err.message
);

}

});

/* ---------- TECHNICIAN REPUTATION ---------- */

cron.schedule('*/12 * * * *', async () => {

try{

await runTechnicianReputation();

}catch(err){

console.error(
"Reputation engine error",
err.message
);

}

});

/* ---------- SURGE PRICING MONITOR ---------- */

cron.schedule('*/6 * * * *', async () => {

try{

console.log("⚡ Surge pricing monitoring active");

}catch(err){

console.error(
"Surge engine error",
err.message
);

}

});

/* ---------- REASSIGNMENT AI ---------- */

cron.schedule('*/3 * * * *', async () => {

try{

await runReassignmentEngine();

}catch(err){

console.error(
"Reassignment engine error",
err.message
);

}

});

/* ---------- SLA MONITOR ---------- */

cron.schedule('*/5 * * * *', async () => {

try{

await runSLAMonitor();

}catch(err){

console.error(
"SLA monitor error",
err.message
);

}

});

/* ---------- MARKETPLACE CONTROLLER ---------- */

cron.schedule('*/7 * * * *', async () => {

try{

await runMarketplaceController();

}catch(err){

console.error(
"Marketplace controller error",
err.message
);

}

});

/* ---------- BUSINESS INTELLIGENCE ---------- */

cron.schedule('15 * * * *', async () => {

try{

await runBusinessIntelligence();

}catch(err){

console.error(
"BI engine error",
err.message
);

}

});

/* ---------- PLATFORM BRAIN ---------- */

cron.schedule('30 * * * *', async () => {

try{

await runPlatformBrain();

}catch(err){

console.error(
"Platform brain error",
err.message
);

}

});

}

module.exports = { startAIOrchestrator };
