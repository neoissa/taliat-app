import { db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { getDefaultRoleTabs, getDefaultBottomTabIds } from '../data/navigationTabsData';
import { resolveIconName } from '../utils/IconRegistry';

const LOCAL_STORAGE_KEY_PREFIX = 'dhulfiqar_nav_prefs_';

/**
 * Normalizes and merges saved user preferences with current role allowed tabs.
 */
export function buildResolvedNavState(savedPrefs, userRoleContext) {
  const defaultTabs = getDefaultRoleTabs(userRoleContext);
  const defaultBottomIds = getDefaultBottomTabIds(userRoleContext);

  if (!savedPrefs) {
    return {
      tabs: defaultTabs,
      bottomTabIds: defaultBottomIds,
      customIcons: {},
      customLabels: {}
    };
  }

  const {
    tabOrder = [],
    hiddenTabs = [],
    bottomNavTabIds = defaultBottomIds,
    customIcons = {},
    customLabels = {}
  } = savedPrefs;

  // Map default tabs by ID for quick lookup
  const defaultTabMap = new Map(defaultTabs.map(t => [t.id, t]));

  // Build ordered tabs list starting with tabOrder
  const orderedTabs = [];
  const processedIds = new Set();

  for (const tabId of tabOrder) {
    if (defaultTabMap.has(tabId)) {
      const baseTab = defaultTabMap.get(tabId);
      const isHidden = hiddenTabs.includes(tabId) && !baseTab.isPermanent;
      orderedTabs.push({
        ...baseTab,
        label: customLabels[tabId] || baseTab.label,
        icon: customIcons[tabId] ? resolveIconName(customIcons[tabId], baseTab.icon) : baseTab.icon,
        visible: !isHidden
      });
      processedIds.add(tabId);
    }
  }

  // Append any new or remaining tabs not in tabOrder
  for (const baseTab of defaultTabs) {
    if (!processedIds.has(baseTab.id)) {
      const isHidden = hiddenTabs.includes(baseTab.id) && !baseTab.isPermanent;
      orderedTabs.push({
        ...baseTab,
        label: customLabels[baseTab.id] || baseTab.label,
        icon: customIcons[baseTab.id] ? resolveIconName(customIcons[baseTab.id], baseTab.icon) : baseTab.icon,
        visible: !isHidden
      });
    }
  }

  // Filter bottom tab IDs to ensure they exist and are valid
  const validBottomIds = (bottomNavTabIds && bottomNavTabIds.length > 0)
    ? bottomNavTabIds.filter(id => defaultTabMap.has(id)).slice(0, 4)
    : defaultBottomIds;

  return {
    tabs: orderedTabs,
    bottomTabIds: validBottomIds.length > 0 ? validBottomIds : defaultBottomIds,
    customIcons,
    customLabels
  };
}

/**
 * Loads navigation preferences from local cache or Firestore.
 */
export async function loadNavPreferences(userId, userRoleContext) {
  if (!userId) {
    return buildResolvedNavState(null, userRoleContext);
  }

  // 1. Try local cache first for instant UI response
  let cachedData = null;
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`);
    if (raw) cachedData = JSON.parse(raw);
  } catch (err) {
    console.warn('Could not read local nav preferences:', err);
  }

  // 2. Fetch from Firestore /users/{userId}/preferences/navLayout
  try {
    const prefRef = doc(db, 'users', userId, 'preferences', 'navLayout');
    const snap = await getDoc(prefRef);
    if (snap.exists()) {
      const firestoreData = snap.data();
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(firestoreData));
      } catch (_) {}
      return buildResolvedNavState(firestoreData, userRoleContext);
    }
  } catch (err) {
    console.warn('Failed to fetch Firestore navLayout preference:', err);
  }

  return buildResolvedNavState(cachedData, userRoleContext);
}

/**
 * Subscribes to real-time navigation preferences changes from Firestore.
 */
export function subscribeToNavPreferences(userId, userRoleContext, onUpdate) {
  if (!userId) {
    onUpdate(buildResolvedNavState(null, userRoleContext));
    return () => {};
  }

  const prefRef = doc(db, 'users', userId, 'preferences', 'navLayout');
  return onSnapshot(prefRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(data));
      } catch (_) {}
      onUpdate(buildResolvedNavState(data, userRoleContext));
    } else {
      // Check local storage fallback
      let localData = null;
      try {
        const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`);
        if (raw) localData = JSON.parse(raw);
      } catch (_) {}
      onUpdate(buildResolvedNavState(localData, userRoleContext));
    }
  }, (err) => {
    console.warn('Realtime navLayout listener error:', err);
  });
}

/**
 * Persists navigation preferences to Firestore and localStorage.
 */
export async function saveNavPreferences(userId, navState) {
  const { tabs = [], bottomTabIds = [], customIcons = {}, customLabels = {} } = navState;

  // Explicitly collect custom icons from all tab objects
  const mergedIcons = { ...customIcons };
  tabs.forEach(t => {
    if (t.icon) {
      mergedIcons[t.id] = t.icon;
    }
  });

  const tabOrder = tabs.map(t => t.id);
  const hiddenTabs = tabs.filter(t => !t.visible && !t.isPermanent).map(t => t.id);

  const payload = {
    tabOrder,
    hiddenTabs,
    bottomNavTabIds: bottomTabIds.slice(0, 4),
    customIcons: mergedIcons,
    customLabels,
    updatedAt: new Date().toISOString()
  };

  // 1. Save to local storage for immediate responsiveness
  if (userId) {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(payload));
    } catch (_) {}
  }

  // 2. Persist to Firestore /users/{userId}/preferences/navLayout
  if (userId) {
    try {
      const prefRef = doc(db, 'users', userId, 'preferences', 'navLayout');
      await setDoc(prefRef, payload, { merge: true });
    } catch (err) {
      console.error('Error saving navLayout to Firestore:', err);
      throw err;
    }
  }

  return payload;
}

/**
 * Resets preferences to factory defaults for the user's role.
 */
export async function resetNavPreferences(userId, userRoleContext) {
  const defaultTabs = getDefaultRoleTabs(userRoleContext);
  const defaultBottomIds = getDefaultBottomTabIds(userRoleContext);

  const defaultPayload = {
    tabOrder: defaultTabs.map(t => t.id),
    hiddenTabs: [],
    bottomNavTabIds: defaultBottomIds,
    customIcons: {},
    customLabels: {},
    updatedAt: new Date().toISOString()
  };

  if (userId) {
    try {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`);
    } catch (_) {}

    try {
      const prefRef = doc(db, 'users', userId, 'preferences', 'navLayout');
      await setDoc(prefRef, defaultPayload);
    } catch (err) {
      console.error('Error resetting navLayout in Firestore:', err);
    }
  }

  return buildResolvedNavState(null, userRoleContext);
}
