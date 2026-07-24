const STORAGE_KEY = "thirdroom-welcome-seen";

export function shouldShowWelcome() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) !== "true";
}

export function markWelcomeSeen() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, "true");
}

export function resetWelcomeForTesting() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
