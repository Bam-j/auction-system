import api from '@/api/axiosInstance';
import {SearchParams} from '@/types/product';

// 닉네임 변경
export const updateMyNickname = (newNickname: string) => {
  return api.patch('/users/me/nickname', {newNickname});
};

// 비밀번호 변경
export const updateMyPassword = (newPassword: string) => {
  return api.patch('/users/me/password', {newPassword});
};

// 이메일 인증 코드 발송
export const sendEmailVerificationCode = (email: string) => {
  return api.post('/email/verification', {email});
};

// 이메일 인증 코드 확인
export const verifyEmailCode = (email: string, code: string) => {
  return api.post('/email/verification/check', {email, code});
};

// 이메일 인증 상태 업데이트
export const updateEmailVerificationStatus = (email: string) => {
  return api.patch('/users/me/verify-email', {email});
};

// 회원 탈퇴 (soft delete)
export const deleteMyAccount = (password: string) => {
  return api.delete('/users/me', {
    data: {password}
  });
};

// 내 등록 상품 조회
export const getMyProducts = (params?: SearchParams) => {
  return api.get('/products/me', {params});
};

// 내 구매 요청 내역 조회
export const getMyPurchaseRequests = (params?: SearchParams) => {
  return api.get('/purchase-requests/me', {params});
};

// 내 즉시 구매 요청 내역 조회 (보낸 것 + 받은 것)
export const getMyInstantBuyRequests = (params?: SearchParams) => {
  return api.get('/instant-buy-requests/me', {params});
};

// 내 입찰 내역 조회
export const getMyBids = (params?: SearchParams) => {
  return api.get('/bids/me', {params});
};

// 내 상품에 대한 구매 요청 조회 (판매자용)
export const getIncomingPurchaseRequests = (params?: SearchParams) => {
  return api.get('/purchase-requests/seller', {params});
};
