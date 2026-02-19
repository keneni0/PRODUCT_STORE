const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function apiRequest(endpoint, options = {}) {
  const token = await getClerkToken();

  const fetchOptions = {
    credentials: options.credentials || 'include',
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
  const text = await response.text();

  if (!response.ok) {
    let errorMessage = text || 'Request failed';
    try {
      const parsed = JSON.parse(text);
      errorMessage = parsed.error || parsed.message || JSON.stringify(parsed);
    } catch (e) {}
    throw new Error(errorMessage);
  }

  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

async function getClerkToken() {
  // Clerk token is automatically sent via cookies with clerkMiddleware
  // For explicit token passing, you'd use Clerk's getToken() method
  return null; // Clerk handles auth via cookies
}

export const api = {
  // Auth
  registerAsSeller: () => apiRequest("/api/auth/register-seller", { method: "POST" }),
  getMyRole: () => apiRequest("/api/auth/my-role"),

  // Products
  getAllProducts: () => apiRequest("/api/products"),
  getProductsByTera: (teraId) => apiRequest(`/api/products/tera/${teraId}`),
  getMyProducts: () => apiRequest("/api/products/my"),
  getProductById: (id) => apiRequest(`/api/products/${id}`),
  createProduct: (data) => apiRequest("/api/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id, data) => apiRequest(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id) => apiRequest(`/api/products/${id}`, { method: "DELETE" }),

  // Users
  syncUser: (data) => apiRequest("/api/users/sync", { method: "POST", body: JSON.stringify(data) }),

  // Admin
  getAllSellers: () => apiRequest("/api/admin/sellers"),
  getAllUsers: () => apiRequest("/api/admin/users"),
  updateUserRole: (userId, role) => apiRequest(`/api/admin/users/${userId}/role`, { method: "PUT", body: JSON.stringify({ role }) }),
  deleteUser: (userId) => apiRequest(`/api/admin/users/${userId}`, { method: "DELETE" }),
  getAllProductsWithSellers: () => apiRequest("/api/admin/products"),
  deleteAnyProduct: (id) => apiRequest(`/api/admin/products/${id}`, { method: "DELETE" }),

  // Comments
  createComment: (productId, content) =>
    apiRequest(`/api/comments/${productId}`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
  deleteComment: (commentId) =>
    apiRequest(`/api/comments/${commentId}`, {
      method: "DELETE",
    }),
};
