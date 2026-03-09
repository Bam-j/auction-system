import api from "@/api/axiosInstance";

export const getAllUsers = (params) => {
  return api.get("/admin/users", { params });
};

export const getAllProducts = (params) => {
  return api.get("/admin/products", { params });
};

export const getAllPurchaseRequests = (params) => {
  return api.get("/admin/purchase-requests", { params });
};

export const getAllBids = (params) => {
  return api.get("/admin/bids", { params });
};

export const blockUser = (userId) => {
  return api.post(`/admin/users/${userId}/block`);
};

export const unblockUser = (userId) => {
  return api.post(`/admin/users/${userId}/unblock`);
};
