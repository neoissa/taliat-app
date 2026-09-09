import { doc, setDoc } from "firebase/firestore";
import { MERIT_BADGES } from "../data/meritBadges.js";

export const ANEHME_BADGE_NAMES = [
  "American Business",
  "Communication",
  "Cooking",
  "Cycling",
  "Family Life",
  "First Aid",
  "Home Repairs",
  "Personal Management",
  "Reading"
];

export const ANEHME_BADGE_IDS = [
  "american-business",
  "communication",
  "cooking",
  "cycling",
  "family-life",
  "first-aid",
  "home-repairs",
  "personal-management",
  "reading"
];

/**
 * Synchronizes the 9 completed merit badges for scout Anehme in Firestore.
 * Sets all requirements to approved and commits metadata to /user_progress/{uid}/merit_badges
 */
export async function syncAnehmeBadges(db, scoutUid) {
  if (!db || !scoutUid) return false;

  try {
    const today = new Date().toISOString().split("T")[0];
    const defaultCertDate = "2026-05-15";

    for (const badgeId of ANEHME_BADGE_IDS) {
      const badgeObj = MERIT_BADGES.find(b => b.id === badgeId);
      if (!badgeObj) continue;

      const steps = {};
      (badgeObj.requirements || []).forEach(r => {
        steps[r.id] = true;
      });

      const badgeDocRef = doc(db, "user_progress", scoutUid, "merit_badges", badgeId);
      await setDoc(badgeDocRef, {
        badgeId: badgeObj.id,
        badgeName: badgeObj.name,
        eagleRequired: !!badgeObj.eagleRequired,
        category: badgeObj.category || "General",
        completed: true,
        pending: false,
        steps: steps,
        dateCompleted: defaultCertDate,
        completedDate: defaultCertDate,
        counselorName: "Hassan A. Issa (Hissa)",
        counselorId: "counselor_hassan_issa",
        approvedBy: "counselor_hassan_issa",
        approvedByName: "Hassan A. Issa (Hissa)",
        certified: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    // Update user document summary
    const userRef = doc(db, "users", scoutUid);
    await setDoc(userRef, {
      meritBadges: ANEHME_BADGE_NAMES,
      meritBadgesCount: ANEHME_BADGE_NAMES.length,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return true;
  } catch (err) {
    console.error("Failed to auto-sync Anehme badges:", err);
    return false;
  }
}
