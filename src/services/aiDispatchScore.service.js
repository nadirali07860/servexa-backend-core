const { getSetting } = require('../core/config/settings.service');

async function calculateDispatchScore(technician){

  const wDistance = Number(await getSetting('dispatch_weight_distance')) || -0.35;
  const wRating = Number(await getSetting('dispatch_weight_rating')) || 2;
  const wReputation = Number(await getSetting('dispatch_weight_reputation')) || 0.02;
  const wLoad = Number(await getSetting('dispatch_weight_load')) || -1;
  const wEta = Number(await getSetting('dispatch_weight_eta')) || -0.5;
  const experienceBonus = Number(await getSetting('dispatch_experience_bonus')) || 0;

  const distanceScore = (technician.distance || 0) * wDistance;

  const ratingScore = (technician.average_rating || 0) * wRating;

  const reputationScore = (technician.reputation_score || 0) * wReputation;

  const loadScore = (technician.active_bookings || 0) * wLoad;

  const etaScore = (technician.eta || 0) * wEta;

  const experienceScore =
    (technician.completed_jobs || 0) > 200
      ? experienceBonus
      : 0;

  const score =
    distanceScore +
    ratingScore +
    reputationScore +
    loadScore +
    etaScore +
    experienceScore;

  return score;

}

module.exports = { calculateDispatchScore };
