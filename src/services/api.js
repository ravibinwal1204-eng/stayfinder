const TOKEN_KEY = "stayfinder_token";
const API_BASE = import.meta.env.VITE_API_URL || (window.location.port === "4173" ? "http://localhost:5000" : "");

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = headers.Authorization || `Bearer ${token}`;

  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch (error) {
    throw new Error(`Unable to reach the StayFinder API. Start the backend or set VITE_API_URL. (${error.message})`);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  health: () => request("/api/health"),

  register: (body) =>
    request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),

  getMe: () => request("/api/auth/me"),

  getProperties: (params = {}) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) q.set(k, v);
    });
    const qs = q.toString();
    return request(`/api/properties${qs ? `?${qs}` : ""}`);
  },

  getMyProperties: () => request("/api/properties/mine"),

  getProperty: (id) => request(`/api/properties/${id}`),

  createProperty: (body) =>
    request("/api/properties", { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) }),

  deleteProperty: (id) =>
    request(`/api/properties/${id}`, { method: "DELETE" }),

  recordEnquiry: (id) =>
    request(`/api/properties/${id}/enquiry`, { method: "POST" }),

  getProfile: () => request("/api/users/profile"),

  saveProfile: (profile) =>
    request("/api/users/profile", { method: "PUT", body: profile instanceof FormData ? profile : JSON.stringify(profile) }),

  getWishlist: () => request("/api/wishlist"),

  addWishlist: (propertyId) =>
    request(`/api/wishlist/${propertyId}`, { method: "POST" }),

  removeWishlist: (propertyId) =>
    request(`/api/wishlist/${propertyId}`, { method: "DELETE" }),

  sendContact: (body) =>
    request("/api/contact", { method: "POST", body: JSON.stringify(body) }),
};
