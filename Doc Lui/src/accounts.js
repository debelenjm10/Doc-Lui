const accountKey = "docLuiAccounts";
const passwordIterations = 120000;

export function readAccounts() {
  const saved = localStorage.getItem(accountKey);
  if (saved === null) return [];

  const accounts = JSON.parse(saved);
  if (!Array.isArray(accounts)) {
    throw new Error("Saved accounts are not in the expected format.");
  }
  return accounts;
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function bytesToHex(bytes) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(value) {
  return Uint8Array.from(value.match(/.{2}/g) ?? [], byte => parseInt(byte, 16));
}

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Secure password hashing is unavailable in this browser.");
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits({
    name: "PBKDF2",
    salt: hexToBytes(salt),
    iterations: passwordIterations,
    hash: "SHA-256"
  }, key, 256);
  return bytesToHex(new Uint8Array(bits));
}

export async function createAccount({ role, username, email = "", password }) {
  if (role !== "client" && role !== "admin") {
    throw new Error("Choose a valid account type.");
  }
  if (!globalThis.crypto?.getRandomValues || !globalThis.crypto?.subtle) {
    throw new Error("Secure account setup is unavailable in this browser.");
  }

  const cleanUsername = username.trim();
  const normalizedUsername = normalize(cleanUsername);
  const normalizedEmail = normalize(email);
  if (!cleanUsername || password.length < 8) {
    throw new Error("Enter a username and a password with at least 8 characters.");
  }
  if (role === "client" && !normalizedEmail) {
    throw new Error("Enter an email address for your client account.");
  }

  const accounts = readAccounts();
  if (role === "admin" && accounts.some(account => account.role === "admin")) {
    throw new Error("An owner account already exists. Sign in with that account.");
  }
  if (accounts.some(account => account.normalizedUsername === normalizedUsername)) {
    throw new Error("That username is already in use.");
  }
  if (role === "client" && accounts.some(account =>
    account.role === "client" && account.email === normalizedEmail
  )) {
    throw new Error("A client account already uses that email address.");
  }

  const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
  const account = {
    role,
    username: cleanUsername,
    normalizedUsername,
    email: role === "client" ? normalizedEmail : "",
    salt,
    passwordHash: await hashPassword(password, salt)
  };
  localStorage.setItem(accountKey, JSON.stringify([...accounts, account]));
  return { role: account.role, username: account.username, email: account.email };
}

export async function authenticateAccount({ role, identifier, password }) {
  const normalizedIdentifier = normalize(identifier);
  const account = readAccounts().find(item =>
    item.role === role && (
      item.normalizedUsername === normalizedIdentifier ||
      (role === "client" && item.email === normalizedIdentifier)
    )
  );
  if (!account) {
    throw new Error("Username or password is incorrect.");
  }

  const passwordHash = await hashPassword(password, account.salt);
  if (passwordHash !== account.passwordHash) {
    throw new Error("Username or password is incorrect.");
  }
  return { role: account.role, username: account.username, email: account.email };
}
