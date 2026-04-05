import api from '@/api/axiosInstance';
import {Product, SearchParams} from '@/types/product';

//상품 등록 데이터 타입
export interface ProductRegisterData {
  //공통
  type: 'FIXED' | 'AUCTION';
  product_name: string;
  description: string;
  category: string;
  image?: File | null;

  //FIXED SALES 전용
  price?: number;
  stock?: number;

  //AUCTION 전용
  ended_at?: string;
  start_price?: number;
  min_bid_increment?: number;
  instant_purchase_price?: number;
  price_unit?: string;
}

//상품 등록 (일반/경매 공통)
export const registerProduct = (productData: ProductRegisterData) => {
  if (productData.type === 'FIXED') {
    const formData = new FormData();

    formData.append('productName', productData.product_name);
    formData.append('description', productData.description);
    formData.append('category', productData.category);
    formData.append('price', String(productData.price));
    formData.append('stock', String(productData.stock));

    if (productData.image) {
      formData.append('image', productData.image);
    }

    return api.post('/fixed-sales', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  if (productData.type === 'AUCTION') {
    const formData = new FormData();

    formData.append('productName', productData.product_name);
    formData.append('description', productData.description);
    formData.append('category', productData.category);
    formData.append('endedAt', String(productData.ended_at));
    formData.append('startPrice', String(productData.start_price));
    formData.append('minBidIncrement', String(productData.min_bid_increment));
    formData.append('instantPurchasePrice', String(productData.instant_purchase_price));
    formData.append('priceUnit', String(productData.price_unit));

    if (productData.image) {
      formData.append('image', productData.image);
    }

    return api.post('/auctions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  return Promise.reject(new Error('알 수 없는 상품 등록 유형입니다.'));
};

// 일반 판매 구매 요청
export const purchaseFixedSale = (purchaseData: { productId: number; quantity: number }) => {
  return api.post('/purchase-requests', purchaseData);
};

// 경매 즉시 구매 요청
export const purchaseInstantBuy = (instantBuyData: { productId: number }) => {
  return api.post('/instant-buy-requests', instantBuyData);
};

// 경매 입찰
export const bidAuction = (bidData: { auctionId: number; bidPrice: number }) => {
  return api.post('/bids', bidData);
};

// 모든 상품 조회
export const getProducts = (params?: SearchParams) => {
  return api.get('/products', {params});
};

// 상품 상세 조회
export const getProductDetail = (productId: number) => {
  return api.get<Product>(`/products/${productId}`);
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

// 모든 즉시 구매 요청 조회 (관리자용)
export const getAllInstantBuyRequests = (params?: SearchParams) => {
  return api.get('/instant-buy-requests/admin', {params});
};

// 즉시 구매 요청 수락
export const approveInstantBuy = (requestId: number) => {
  return api.post(`/instant-buy-requests/${requestId}/approve`);
};

// 즉시 구매 요청 거절
export const rejectInstantBuy = (requestId: number) => {
  return api.post(`/instant-buy-requests/${requestId}/reject`);
};

// 내 입찰 내역 조회
export const getMyBids = (params?: SearchParams) => {
  return api.get('/bids/me', {params});
};

// 내 상품 판매 종료
export const endSale = (productId: number) => {
  return api.post(`/products/${productId}/end`);
};

// 내 상품에 대한 구매 요청 조회 (판매자용)
export const getIncomingPurchaseRequests = (params?: SearchParams) => {
  return api.get('/purchase-requests/seller', {params});
};

// 구매 요청 수락
export const approvePurchaseRequest = (requestId: number) => {
  return api.post(`/purchase-requests/${requestId}/approve`);
};

// 구매 요청 거절
export const rejectPurchaseRequest = (requestId: number) => {
  return api.post(`/purchase-requests/${requestId}/reject`);
};

// 구매 요청 취소 (구매자용)
export const cancelPurchaseRequest = (requestId: number) => {
  return api.post(`/purchase-requests/${requestId}/cancel`);
};
