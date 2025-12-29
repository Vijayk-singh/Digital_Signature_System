// Base API URL — change if backend is deployed
export const API_URL = "http://127.0.0.1:8000";

// Helper function to handle responses and errors
async function handleResponse(res) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }
  return res.json();
}

// --- Auth APIs ---

// Register a new user
export async function registerUser(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Login existing user
export async function loginUser(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Verify email token
export async function verifyEmail(token) {
  const res = await fetch(`${API_URL}/auth/verify/${token}`);
  return handleResponse(res);
}

// --- Public keys ---

// Fetch all public keys (verified users)
export async function getPublicKeys() {
  const res = await fetch(`${API_URL}/public-keys`);
  return handleResponse(res);
}

// --- File signing and verification ---

// Sign a file (requires JWT token)
export async function signFile(file, token) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("text", privatekey)

  const res = await fetch(`${API_URL}/dss/sign`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return handleResponse(res);
}

// Verify a signed file
export async function verifyFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/dss/verify`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(res);
}
