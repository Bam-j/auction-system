import api from '@/api/axiosInstance';

// 회원 통계 조회 (일일/주간/월간)
export const getUserStats = (days: number = 7) => {
  return api.get('/admin/dashboard/user-stats', {params: {days}});
};

// 상품 통계 조회
export const getProductStats = (days: number = 7) => {
  return api.get('/admin/dashboard/product-stats', {params: {days}});
};

// 경매 통계 조회
export const getAuctionStats = (days: number = 7) => {
  return api.get('/admin/dashboard/auction-stats', {params: {days}});
};

// 일반 판매 통계 조회
export const getFixedSaleStats = (days: number = 7) => {
  return api.get('/admin/dashboard/fixed-sale-stats', {params: {days}});
};
