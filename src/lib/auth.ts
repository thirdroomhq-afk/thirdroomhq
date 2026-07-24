export function isAuthenticated() {
  if (typeof window === "undefined") return true;
  return Boolean(window.localStorage.getItem("thirdroom-auth"));
}

export function signInDemo() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("thirdroom-auth", "demo-user");
}

export function signOutDemo() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("thirdroom-auth");
}
