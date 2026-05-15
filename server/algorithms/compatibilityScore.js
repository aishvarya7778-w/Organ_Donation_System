const normalize = (value) => String(value || '').trim().toLowerCase();

const bloodCompatibility = {
  'o-': ['o-', 'o+', 'a-', 'a+', 'b-', 'b+', 'ab-', 'ab+'],
  'o+': ['o+', 'a+', 'b+', 'ab+'],
  'a-': ['a-', 'a+', 'ab-', 'ab+'],
  'a+': ['a+', 'ab+'],
  'b-': ['b-', 'b+', 'ab-', 'ab+'],
  'b+': ['b+', 'ab+'],
  'ab-': ['ab-', 'ab+'],
  'ab+': ['ab+']
};

const urgencyScores = {
  low: 5,
  medium: 10,
  high: 15,
  critical: 20
};

const clampScore = (score) => Math.max(0, Math.min(100, Math.round(score)));

const isOrganCompatible = (donor, recipient) => {
  return normalize(donor.organType) === normalize(recipient.requiredOrgan);
};

const isBloodCompatible = (donorBloodGroup, recipientBloodGroup) => {
  const donorGroup = normalize(donorBloodGroup);
  const recipientGroup = normalize(recipientBloodGroup);

  return Boolean(bloodCompatibility[donorGroup]?.includes(recipientGroup));
};

const getUrgencyScore = (urgencyLevel) => {
  return urgencyScores[normalize(urgencyLevel)] || 0;
};

const getHealthScore = (organHealthScore) => {
  const healthScore = Number(organHealthScore) || 0;
  return Math.min(20, Math.max(0, healthScore * 0.2));
};

const getAgeCompatibilityScore = (donorAge, recipientAge) => {
  const ageDifference = Math.abs(Number(donorAge) - Number(recipientAge));

  if (ageDifference <= 5) return 10;
  if (ageDifference <= 10) return 8;
  if (ageDifference <= 20) return 6;
  if (ageDifference <= 35) return 3;
  return 1;
};

const getAgeReason = (donorAge, recipientAge) => {
  const ageDifference = Math.abs(Number(donorAge) - Number(recipientAge));

  if (ageDifference <= 10) return 'Small age difference';
  if (ageDifference <= 35) return 'Moderate age difference';
  return 'Large age difference';
};

const getUrgencyReason = (urgencyLevel) => {
  const normalizedUrgency = normalize(urgencyLevel);

  if (normalizedUrgency === 'critical') return 'Critical recipient';
  if (normalizedUrgency === 'high') return 'Urgent recipient';
  if (normalizedUrgency === 'medium') return 'Moderate recipient urgency';
  return 'Low recipient urgency';
};

const getHealthReason = (organHealthScore, requiredHealthThreshold) => {
  const healthScore = Number(organHealthScore) || 0;
  const threshold = Number(requiredHealthThreshold) || 0;

  if (healthScore >= 85) return 'High organ health score';
  if (healthScore >= threshold) return 'Organ health meets recipient threshold';
  return 'Organ health below recipient threshold';
};

const calculateCompatibility = (donor, recipient) => {
  const reasons = [];

  if (!isOrganCompatible(donor, recipient)) {
    return {
      score: 0,
      compatible: false,
      reasons: ['Different organ type']
    };
  }

  let score = 20;
  reasons.push('Organ type compatible');

  if (!isBloodCompatible(donor.bloodGroup, recipient.bloodGroup)) {
    return {
      score: 10,
      compatible: false,
      reasons: [...reasons, 'Blood group incompatible']
    };
  }

  score += 30;
  reasons.push('Blood group compatible');

  const healthScore = getHealthScore(donor.organHealthScore);
  score += healthScore;
  reasons.push(getHealthReason(donor.organHealthScore, recipient.requiredHealthThreshold));

  const urgencyScore = getUrgencyScore(recipient.urgencyLevel);
  score += urgencyScore;
  reasons.push(getUrgencyReason(recipient.urgencyLevel));

  score += getAgeCompatibilityScore(donor.age, recipient.age);
  reasons.push(getAgeReason(donor.age, recipient.age));

  return {
    score: clampScore(score),
    compatible: true,
    reasons
  };
};

module.exports = calculateCompatibility;
module.exports.isBloodCompatible = isBloodCompatible;
module.exports.isOrganCompatible = isOrganCompatible;
module.exports.getAgeCompatibilityScore = getAgeCompatibilityScore;
