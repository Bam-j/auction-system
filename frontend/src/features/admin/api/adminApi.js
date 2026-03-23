import api from "@/api/axiosInstance";

//모든 유저 조회
export const getAllUsers = (params) => {
  return api.get("/admin/users", {params});
};

//모든 상품 조회
export const getAllProducts = (params) => {
  return api.get("/admin/products", {params});
};

//모든 일반 구매 요청 조회
export const getAllPurchaseRequests = (params) => {
  return api.get("/admin/purchase-requests", {params});
};

//모든 입찰 조회
export const getAllBids = (params) => {
  return api.get("/admin/bids", {params});
};

//회원 차단
export const blockUser = (userId) => {
  return api.post(`/admin/users/${userId}/block`);
};

//회원 차단 해제
export const unblockUser = (userId) => {
  return api.post(`/admin/users/${userId}/unblock`);
};
