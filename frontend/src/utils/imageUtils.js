export const getFullImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl === 'null' || imageUrl === '') return null;
  
  // 이미 전체 URL인 경우 (http:// 또는 https://로 시작) 그대로 반환
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // /uploads/로 시작하는 경우 백엔드 주소를 붙여서 반환
  const backendBaseUrl = 'http://localhost:8080';
  
  if (imageUrl.startsWith('/')) {
    return `${backendBaseUrl}${imageUrl}`;
  }
  
  return `${backendBaseUrl}/${imageUrl}`;
};
