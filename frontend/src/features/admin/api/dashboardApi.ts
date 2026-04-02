import api from '@/api/axiosInstance';

// 회원 통계 조회 (일일/주간/월간)
export const getUserStats = (days: number = 7) => {
  return api.get('/admin/dashboard/user-stats', {params: {days}});
};
