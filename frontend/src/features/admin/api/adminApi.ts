import api from '@/api/axiosInstance';

//모든 유저 조회
export const getAllUsers = (params?: any) => {
  return api.get('/admin/users', {params});
};

//모든 상품 조회
export const getAllProducts = (params?: any) => {
  return api.get('/admin/products', {params});
};

//모든 일반 구매 요청 조회
export const getAllPurchaseRequests = (params?: any) => {
  return api.get('/admin/purchase-requests', {params});
};

//모든 입찰 조회
export const getAllBids = (params?: any) => {
  return api.get('/admin/bids', {params});
};

//회원 차단
export const blockUser = (userId: string | number) => {
  return api.post(`/admin/users/${userId}/block`);
};

//회원 차단 해제
export const unblockUser = (userId: string | number) => {
  return api.post(`/admin/users/${userId}/unblock`);
};
