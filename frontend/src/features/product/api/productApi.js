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
