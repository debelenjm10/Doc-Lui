const roleKey = "docLuiRole";
const clientEmailKey = "docLuiClientEmail";
const authVersionKey = "docLuiAuthVersion";

export function readAccess() {
  if (localStorage.getItem(authVersionKey) !== "1") return null;

  const role = localStorage.getItem(roleKey);
  if (role === "admin") return { role };
  if (role === "client") {
    return { role, email: localStorage.getItem(clientEmailKey) ?? "" };
  }
  return null;
}

export function writeAccess({ role, email = "" }) {
  localStorage.setItem(roleKey, role);
  if (role === "client") {
    localStorage.setItem(clientEmailKey, email.trim().toLowerCase());
  } else {
    localStorage.removeItem(clientEmailKey);
  }
  localStorage.setItem(authVersionKey, "1");
}

export function clearAccess() {
  localStorage.removeItem(roleKey);
  localStorage.removeItem(clientEmailKey);
  localStorage.removeItem(authVersionKey);
}
