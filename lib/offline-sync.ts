/**
 * Offline Resilience & Local Roster Synchronization for Yuva Shakti Sangam
 * Enables gate scanners to continue operating seamlessly even with spotty or completely lost mobile data.
 */

import { Participant } from "@/types/registration";

export interface QueuedOfflineAction {
  id: string;
  type: "confirm" | "cash" | "spot_online";
  participant_id: string;
  utr?: string;
  notes?: string;
  timestamp: string;
}

const ROSTER_KEY = "yss_offline_roster_cache";
const QUEUE_KEY = "yss_offline_actions_queue";
const LAST_SYNC_KEY = "yss_offline_last_sync_time";

/**
 * Perform a fetch with an aggressive timeout for spotty mobile networks.
 * Falls back quickly instead of hanging on congested cell towers.
 */
export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 2800): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Check if the browser currently reports online connectivity.
 */
export function isNetworkOnline(): boolean {
  if (typeof window === "undefined") return true;
  return navigator.onLine;
}

/**
 * Retrieve the offline roster from localStorage.
 */
export function getOfflineRoster(): Participant[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ROSTER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Failed to parse offline roster from localStorage:", e);
    return [];
  }
}

/**
 * Save roster to localStorage.
 */
export function saveOfflineRoster(roster: Participant[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  } catch (e) {
    console.warn("Failed to write offline roster to localStorage:", e);
  }
}

/**
 * Retrieve the last roster download timestamp.
 */
export function getLastSyncTime(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LAST_SYNC_KEY);
}

/**
 * Download and cache the full attendee roster from the server.
 */
export async function fetchAndCacheRoster(): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const res = await fetchWithTimeout("/api/checkin/roster", { method: "GET" }, 6000);
    const data = await res.json();

    if (data.success && Array.isArray(data.participants)) {
      saveOfflineRoster(data.participants);
      return { success: true, count: data.participants.length };
    }

    return { success: false, count: 0, error: data.error || "Roster download failed" };
  } catch (err: any) {
    console.warn("Could not fetch remote roster for cache update:", err.message);
    return { success: false, count: 0, error: err.message };
  }
}

/**
 * Lookup participant from the local offline roster.
 */
export function lookupParticipantOffline(query: string): Participant | null {
  if (!query || typeof query !== "string") return null;

  let cleanQuery = query.trim();
  if (cleanQuery.includes("/ticket/")) {
    cleanQuery = cleanQuery.split("/ticket/")[1].split("?")[0].split("#")[0];
  }

  const cleanPhone = cleanQuery.replace(/\D/g, "");
  const roster = getOfflineRoster();

  // 1. Exact match on qr_token
  const byToken = roster.find((p) => p.qr_token && p.qr_token === cleanQuery);
  if (byToken) return byToken;

  // 2. Exact match on registration_id
  const byRegId = roster.find(
    (p) => p.registration_id && p.registration_id.toUpperCase() === cleanQuery.toUpperCase()
  );
  if (byRegId) return byRegId;

  // 3. Match by phone
  if (cleanPhone.length >= 10) {
    const byPhone = roster.find((p) => p.phone && p.phone.replace(/\D/g, "").includes(cleanPhone));
    if (byPhone) return byPhone;
  }

  // 4. Case-insensitive substring match on name or ID
  const lowerQuery = cleanQuery.toLowerCase();
  const byName = roster.find(
    (p) =>
      (p.name && p.name.toLowerCase().includes(lowerQuery)) ||
      (p.registration_id && p.registration_id.toLowerCase().includes(lowerQuery))
  );

  return byName || null;
}

/**
 * Update a participant's status in the local cache immediately (Optimistic Update).
 */
export function updateLocalParticipantStatus(
  participantId: string,
  updates: Partial<Participant>
): void {
  const roster = getOfflineRoster();
  const index = roster.findIndex((p) => p.id === participantId);

  if (index !== -1) {
    roster[index] = { ...roster[index], ...updates };
    saveOfflineRoster(roster);
  }
}

/**
 * Get the list of offline actions waiting to be synchronized with the server.
 */
export function getQueuedOfflineActions(): QueuedOfflineAction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Queue an offline check-in, cash collection, or UPI verification action.
 */
export function queueOfflineAction(
  action: Omit<QueuedOfflineAction, "id">
): QueuedOfflineAction {
  const queue = getQueuedOfflineActions();
  const id = "act_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  const newAction: QueuedOfflineAction = {
    ...action,
    id,
    timestamp: action.timestamp || new Date().toISOString(),
  };

  queue.push(newAction);

  if (typeof window !== "undefined") {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  // Apply optimistic updates to local roster so subsequent scans reflect it
  if (action.type === "confirm") {
    updateLocalParticipantStatus(action.participant_id, {
      checked_in: true,
      check_in_time: newAction.timestamp,
    });
  } else if (action.type === "cash") {
    updateLocalParticipantStatus(action.participant_id, {
      payment_status: "paid",
      payment_method: "cash",
      checked_in: true,
      check_in_time: newAction.timestamp,
    });
  } else if (action.type === "spot_online") {
    updateLocalParticipantStatus(action.participant_id, {
      payment_status: "paid",
      payment_method: "online",
      checked_in: true,
      check_in_time: newAction.timestamp,
    });
  }

  return newAction;
}

/**
 * Synchronize all queued offline actions to the backend server.
 */
export async function syncQueuedOfflineActions(): Promise<{
  success: boolean;
  syncedCount: number;
  remainingCount: number;
  error?: string;
}> {
  const queue = getQueuedOfflineActions();

  if (queue.length === 0) {
    return { success: true, syncedCount: 0, remainingCount: 0 };
  }

  try {
    const res = await fetchWithTimeout(
      "/api/checkin/sync-offline",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actions: queue }),
      },
      8000
    );

    const data = await res.json();

    if (data.success && Array.isArray(data.results)) {
      // Find IDs that succeeded
      const successfulIds = new Set(
        data.results.filter((r: any) => r.success).map((r: any) => r.id)
      );

      // Keep only actions that failed in the queue
      const remainingQueue = queue.filter((a) => !successfulIds.has(a.id));

      if (typeof window !== "undefined") {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(remainingQueue));
      }

      // Refresh local roster in background
      fetchAndCacheRoster().catch(() => {});

      return {
        success: true,
        syncedCount: successfulIds.size,
        remainingCount: remainingQueue.length,
      };
    }

    return {
      success: false,
      syncedCount: 0,
      remainingCount: queue.length,
      error: data.error || "Batch sync was not acknowledged",
    };
  } catch (err: any) {
    console.warn("Sync failed (likely still offline):", err.message);
    return {
      success: false,
      syncedCount: 0,
      remainingCount: queue.length,
      error: err.message,
    };
  }
}
