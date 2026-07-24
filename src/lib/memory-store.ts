export interface MemoryEntry {
  id: string;
  title: string;
  details: string;
  type: string;
  createdAt: string;
}

const STORAGE_KEY = "thirdroom-memory-items";

function safeRead(): MemoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MemoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadMemoryEntries() {
  return safeRead();
}

export function saveMemoryEntry(entry: Omit<MemoryEntry, "id" | "createdAt">) {
  const nextEntry: MemoryEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...entry,
  };

  const items = [nextEntry, ...safeRead()].slice(0, 25);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  return nextEntry;
}

export function clearMemoryEntries() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
