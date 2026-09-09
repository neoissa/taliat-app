import { MERIT_BADGES } from "../data/meritBadges.js";
import { MERIT_BADGE_COUNSELORS } from "../data/counselorsData.js";

export function getRecommendedBadges(scoutProfile = {}, userBadgesProgress = {}) {
  const currentRank = (scoutProfile?.rank || "Scout").toLowerCase();
  const completedBadgeIds = new Set();
  const inProgressBadgeIds = new Set();

  Object.entries(userBadgesProgress || {}).forEach(([bId, data]) => {
    const isCompleted = data?.completed === true || data?.dateCompleted || data?.earned === true;
    if (isCompleted) {
      completedBadgeIds.add(bId.toLowerCase());
    } else if (data?.steps && Object.values(data.steps).some(s => s === true || s?.completed === true)) {
      inProgressBadgeIds.add(bId.toLowerCase());
    }
  });

  const badgeCounselorMap = new Map();
  MERIT_BADGE_COUNSELORS.forEach(counselor => {
    (counselor.authorizedBadges || []).forEach(badgeName => {
      const normalizedName = badgeName.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!badgeCounselorMap.has(normalizedName)) {
        badgeCounselorMap.set(normalizedName, []);
      }
      badgeCounselorMap.get(normalizedName).push(counselor);
    });
  });

  const recommendations = [];

  MERIT_BADGES.forEach(badge => {
    const badgeIdNorm = badge.id.toLowerCase().replace(/[^a-z0-9]/g, "");
    const badgeNameNorm = badge.name.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (completedBadgeIds.has(badge.id.toLowerCase()) || completedBadgeIds.has(badgeNameNorm)) {
      return;
    }

    let score = 0;
    const reasons = [];

    const matchingCounselors = badgeCounselorMap.get(badgeNameNorm) || badgeCounselorMap.get(badgeIdNorm) || [];
    const hasInHouseCounselor = matchingCounselors.length > 0;
    const primaryCounselor = hasInHouseCounselor ? matchingCounselors[0] : null;

    if (hasInHouseCounselor) {
      score += 55;
      reasons.push("In-house sign-off ready with " + primaryCounselor.leaderName);
    }

    if (badge.eagleRequired) {
      score += 45;
      if (["scout", "tenderfoot", "second class", "first class"].includes(currentRank)) {
        reasons.push("Essential milestone for Star & Eagle Scout pathway");
      } else if (currentRank.includes("star") || currentRank.includes("life")) {
        reasons.push("High-priority Eagle-required badge for Board of Review");
      } else {
        reasons.push("Eagle-Required core badge");
      }
    }

    const isTechBadge = ["artificial-intelligence", "cybersecurity", "robotics", "programming", "digital-technology", "engineering", "inventing", "electronics", "electricity", "nuclear-science"].includes(badge.id);
    if (isTechBadge) {
      score += 35;
      reasons.push("High-demand STEM & Innovation specialization");
    }

    const isOutdoorCore = ["camping", "cooking", "first-aid", "emergency-preparedness", "cycling"].includes(badge.id);
    if (isOutdoorCore) {
      score += 30;
      reasons.push("Core troop outdoor & camping practical skill");
    }

    if (inProgressBadgeIds.has(badge.id.toLowerCase()) || inProgressBadgeIds.has(badgeNameNorm)) {
      score += 25;
      reasons.push("Already in progress — finish for next Court of Honor");
    }

    if (score >= 40) {
      recommendations.push({
        id: badge.id,
        name: badge.name,
        eagleRequired: !!badge.eagleRequired,
        category: badge.category || (isTechBadge ? "STEM & Technology" : isOutdoorCore ? "Outdoor Skills" : "General Elective"),
        description: badge.description || "",
        pageUrl: badge.pageUrl || "",
        packetPdfUrl: badge.packetPdfUrl || "",
        score,
        hasInHouseCounselor,
        counselorName: primaryCounselor ? primaryCounselor.leaderName : "Troop Counselor",
        counselorId: primaryCounselor ? primaryCounselor.id : null,
        counselorEmail: primaryCounselor ? primaryCounselor.email : null,
        reasons,
        mainReason: reasons[0] || "Recommended for your scout pathway"
      });
    }
  });

  recommendations.sort((a, b) => b.score - a.score);
  return recommendations;
}

export default getRecommendedBadges;