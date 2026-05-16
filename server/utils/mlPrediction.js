const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://https://organ-ml-service.onrender.com/predict';

const BLOOD_GROUP_MAP = {
  O_PLUS: 0,
  A_PLUS: 1,
  B_PLUS: 2,
  AB_PLUS: 3,
  O: 0,
  A: 1,
  B: 2,
  AB: 3,
  'O+': 0,
  'A+': 1,
  'B+': 2,
  'AB+': 3,
  'O-': 0,
  'A-': 1,
  'B-': 2,
  'AB-': 3,
};

const ORGAN_TYPE_MAP = {
  kidney: 0,
  liver: 1,
  heart: 2,
  Kidney: 0,
  Liver: 1,
  Heart: 2,
};

const URGENCY_LEVEL_MAP = {
  low: 2,
  medium: 5,
  high: 8,
  critical: 10,
  Low: 2,
  Medium: 5,
  High: 8,
  Critical: 10,
};

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');

const mapBloodGroup = (bloodGroup) => {
  const normalized = normalizeString(bloodGroup).toUpperCase();
  return BLOOD_GROUP_MAP[normalized] ?? 0;
};

const mapOrganType = (organType) => {
  const normalized = normalizeString(organType).toLowerCase();
  return ORGAN_TYPE_MAP[normalized] ?? 0;
};

const mapUrgencyLevel = (urgencyLevel) => {
  const normalized = normalizeString(urgencyLevel);
  return URGENCY_LEVEL_MAP[normalized] ?? 5;
};

const buildPayload = (donor, recipient) => ({
  bloodGroup: mapBloodGroup(donor.bloodGroup),
  organType: mapOrganType(donor.organType),
  donorAge: Number(donor.age) || 0,
  recipientAge: Number(recipient.age) || 0,
  urgency: mapUrgencyLevel(recipient.urgencyLevel),
  healthScore: Number(donor.organHealthScore) || 0,
});

const getMLPrediction = async (donor, recipient) => {
  const payload = buildPayload(donor, recipient);

  try {
    const response = await axios.post(ML_SERVICE_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });

    const data = response.data || {};
    const compatible = Number.isInteger(data.compatible) ? data.compatible : null;
    const confidence = typeof data.confidence === 'number' ? Number(data.confidence) : null;

    return {
      mlPrediction: compatible,
      mlConfidence: confidence
    };
  } catch (error) {
    console.error('ML prediction request failed:', error.message || error);
    return {
      mlPrediction: null,
      mlConfidence: null
    };
  }
};

module.exports = {
  getMLPrediction
};
