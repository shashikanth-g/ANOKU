import { getToken, clearToken } from './auth';

const API_URL = "http://192.168.1.12:8000/api/v1";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login?expired=true';
    }
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "An error occurred" }));
    throw new Error(error.detail || "Request failed");
  }

  return response.json();
}
