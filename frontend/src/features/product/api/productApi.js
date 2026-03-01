import api from "@/api/axiosInstance";

// 상품 등록 (일반/경매 공통)
export const registerProduct = (productData) => {
  if (productData.type === "FIXED") {
    const formData = new FormData();
    
    formData.append("productName", productData.product_name);
    formData.append("description", productData.description);
    formData.append("category", productData.category);
    formData.append("price", productData.price);
    formData.append("stock", productData.stock);

    if (productData.image) {
      formData.append("image", productData.image);
    }

    return api.post("/fixed-sales", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  
  if (productData.type === "AUCTION") {
    const formData = new FormData();
    
    formData.append("productName", productData.product_name);
    formData.append("description", productData.description);
    formData.append("category", productData.category);
    formData.append("endedAt", productData.ended_at);
    formData.append("startPrice", productData.start_price);
    formData.append("minBidIncrement", productData.min_bid_increment);
    formData.append("instantPurchasePrice", productData.instant_purchase_price);
    formData.append("priceUnit", productData.price_unit);

    if (productData.image) {
      formData.append("image", productData.image);
    }

    return api.post("/auctions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  
  return Promise.reject(new Error("알 수 없는 상품 등록 유형입니다."));
};

// 일반 판매 구매 요청
export const purchaseFixedSale = (purchaseData) => {
  return api.post("/purchase-requests", purchaseData);
};

// 모든 상품 조회
export const getProducts = () => {
  return api.get("/products");
};

// 상품 상세 조회
export const getProductDetail = (productId) => {
  return api.get(`/products/${productId}`);
};

// 내 등록 상품 조회
export const getMyProducts = () => {
  return api.get("/products/me");
};

// 내 구매 요청 내역 조회
export const getMyPurchaseRequests = () => {
  return api.get("/purchase-requests/me");
};

// 내 입찰 내역 조회
export const getMyBids = () => {
  return api.get("/bids/me");
};

// 내 상품 판매 종료
export const endSale = (productId) => {
  return api.post(`/products/${productId}/end`);
};

// 내 상품에 대한 구매 요청 조회 (판매자용)
export const getIncomingPurchaseRequests = () => {
  return api.get("/purchase-requests/seller");
};

// 구매 요청 수락
export const approvePurchaseRequest = (requestId) => {
  return api.post(`/purchase-requests/${requestId}/approve`);
};

// 구매 요청 거절
export const rejectPurchaseRequest = (requestId) => {
  return api.post(`/purchase-requests/${requestId}/reject`);
};

// 구매 요청 취소 (구매자용)
export const cancelPurchaseRequest = (requestId) => {
  return api.post(`/purchase-requests/${requestId}/cancel`);
};
