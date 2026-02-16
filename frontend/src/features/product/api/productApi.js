import api from "@/api/axiosInstance";

// 상품 등록 (일반/경매 공통)
export const registerProduct = (productData) => {
  const formData = new FormData();

  Object.keys(productData).forEach((key) => {
    if (productData[key] !== null && key !== "image") {
      formData.append(key, productData[key]);
    }
  });

  if (productData.image) {
    formData.append("image", productData.image);
  }

  return api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
