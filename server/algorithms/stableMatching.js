const calculateCompatibility = require('./compatibilityScore');

const getId = (entity) => entity._id.toString();

const buildEntityMap = (entities) => {
  return new Map(entities.map((entity) => [getId(entity), entity]));
};

const buildCompatibilityLookup = (donors, recipients) => {
  const lookup = new Map();

  donors.forEach((donor) => {
    recipients.forEach((recipient) => {
      lookup.set(`${getId(donor)}:${getId(recipient)}`, calculateCompatibility(donor, recipient));
    });
  });

  return lookup;
};

const getCompatibility = (lookup, donorId, recipientId) => {
  return lookup.get(`${donorId}:${recipientId}`);
};

const buildDonorPreferenceLists = (donors, recipients, compatibilityLookup) => {
  const preferences = new Map();

  donors.forEach((donor) => {
    const donorId = getId(donor);
    const rankedRecipients = recipients
      .map((recipient) => {
        const recipientId = getId(recipient);
        const compatibility = getCompatibility(compatibilityLookup, donorId, recipientId);

        return {
          recipientId,
          compatibilityScore: compatibility.score,
          compatible: compatibility.compatible,
          reasons: compatibility.reasons
        };
      })
      .filter((entry) => entry.compatible && entry.compatibilityScore > 0)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    preferences.set(donorId, rankedRecipients);
  });

  return preferences;
};

const buildRecipientPreferenceLists = (donors, recipients, compatibilityLookup) => {
  const preferences = new Map();

  recipients.forEach((recipient) => {
    const recipientId = getId(recipient);
    const rankedDonors = donors
      .map((donor) => {
        const donorId = getId(donor);
        const compatibility = getCompatibility(compatibilityLookup, donorId, recipientId);

        return {
          donorId,
          compatibilityScore: compatibility.score,
          compatible: compatibility.compatible,
          reasons: compatibility.reasons
        };
      })
      .filter((entry) => entry.compatible && entry.compatibilityScore > 0)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    preferences.set(recipientId, rankedDonors);
  });

  return preferences;
};

const buildRecipientRankMap = (recipientPreferences) => {
  const rankMap = new Map();

  recipientPreferences.forEach((rankedDonors, recipientId) => {
    const donorRanks = new Map();

    rankedDonors.forEach((entry, index) => {
      donorRanks.set(entry.donorId, index);
    });

    rankMap.set(recipientId, donorRanks);
  });

  return rankMap;
};

const formatAllocations = (matches, donorsById, recipientsById, compatibilityLookup) => {
  return Array.from(matches.entries())
    .map(([recipientId, donorId]) => {
      const donor = donorsById.get(donorId);
      const recipient = recipientsById.get(recipientId);
      const compatibility = getCompatibility(compatibilityLookup, donorId, recipientId);

      return {
        donor,
        recipient,
        donorName: donor.fullName,
        recipientName: recipient.patientName,
        compatibilityScore: compatibility.score,
        reasons: compatibility.reasons
      };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
};

const runGaleShapley = (donors, recipients, donorPreferences, recipientRankMap) => {
  const freeDonorIds = donors.map(getId);
  const nextProposalIndex = new Map(donors.map((donor) => [getId(donor), 0]));
  const recipientMatches = new Map();

  while (freeDonorIds.length > 0) {
    const donorId = freeDonorIds.shift();
    const preferences = donorPreferences.get(donorId) || [];
    const proposalIndex = nextProposalIndex.get(donorId) || 0;

    // A donor with no remaining compatible recipients remains unmatched.
    if (proposalIndex >= preferences.length) {
      continue;
    }

    const proposedRecipientId = preferences[proposalIndex].recipientId;
    nextProposalIndex.set(donorId, proposalIndex + 1);

    const currentDonorId = recipientMatches.get(proposedRecipientId);

    // Unmatched recipients tentatively accept the first compatible proposal.
    if (!currentDonorId) {
      recipientMatches.set(proposedRecipientId, donorId);
      continue;
    }

    const recipientRanks = recipientRankMap.get(proposedRecipientId) || new Map();
    const currentRank = recipientRanks.get(currentDonorId) ?? Number.POSITIVE_INFINITY;
    const challengerRank = recipientRanks.get(donorId) ?? Number.POSITIVE_INFINITY;

    // Recipients keep the donor they rank higher and release the weaker match.
    if (challengerRank < currentRank) {
      recipientMatches.set(proposedRecipientId, donorId);
      freeDonorIds.push(currentDonorId);
    } else {
      freeDonorIds.push(donorId);
    }
  }

  return recipientMatches;
};

const stableMatching = (donors, recipients) => {
  if (!donors.length || !recipients.length) {
    return {
      allocations: [],
      donorPreferences: new Map(),
      recipientPreferences: new Map(),
      compatibilityLookup: new Map()
    };
  }

  const donorsById = buildEntityMap(donors);
  const recipientsById = buildEntityMap(recipients);
  const compatibilityLookup = buildCompatibilityLookup(donors, recipients);
  const donorPreferences = buildDonorPreferenceLists(donors, recipients, compatibilityLookup);
  const recipientPreferences = buildRecipientPreferenceLists(donors, recipients, compatibilityLookup);
  const recipientRankMap = buildRecipientRankMap(recipientPreferences);

  // Donors propose in preference order; recipients hold only their strongest proposal.
  const matches = runGaleShapley(donors, recipients, donorPreferences, recipientRankMap);
  const allocations = formatAllocations(matches, donorsById, recipientsById, compatibilityLookup);

  return {
    allocations,
    donorPreferences,
    recipientPreferences,
    compatibilityLookup
  };
};

module.exports = stableMatching;
module.exports.buildCompatibilityLookup = buildCompatibilityLookup;
module.exports.buildDonorPreferenceLists = buildDonorPreferenceLists;
module.exports.buildRecipientPreferenceLists = buildRecipientPreferenceLists;
